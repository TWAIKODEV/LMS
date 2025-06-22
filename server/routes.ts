import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { scormData, h5pContent, courses, enrollments } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // SCORM Data API endpoints
  app.get("/api/scorm/data", async (req, res) => {
    try {
      const data = await db.select({
        id: scormData.id,
        userId: scormData.userId,
        courseId: scormData.courseId,
        lessonStatus: scormData.lessonStatus,
        score: scormData.score,
        sessionTime: scormData.sessionTime,
        location: scormData.location,
        suspendData: scormData.suspendData,
        interactions: scormData.interactions,
        objectives: scormData.objectives,
        createdAt: scormData.createdAt,
        updatedAt: scormData.updatedAt
      })
      .from(scormData)
      .orderBy(desc(scormData.updatedAt))
      .limit(50);

      res.json(data);
    } catch (error) {
      console.error("Error fetching SCORM data:", error);
      res.status(500).json({ error: "Failed to fetch SCORM data" });
    }
  });

  app.post("/api/scorm/track", async (req, res) => {
    try {
      const { userId, courseId, lessonStatus, score, sessionTime, location, suspendData, interactions, objectives } = req.body;
      
      // Check if SCORM data already exists for this user and course
      const existing = await db.select()
        .from(scormData)
        .where(eq(scormData.userId, userId))
        .where(eq(scormData.courseId, courseId))
        .limit(1);

      if (existing.length > 0) {
        // Update existing record
        const updated = await db.update(scormData)
          .set({
            lessonStatus,
            score,
            sessionTime,
            location,
            suspendData,
            interactions,
            objectives,
            updatedAt: new Date()
          })
          .where(eq(scormData.id, existing[0].id))
          .returning();
        
        res.json(updated[0]);
      } else {
        // Create new record
        const created = await db.insert(scormData)
          .values({
            userId,
            courseId,
            lessonStatus,
            score,
            sessionTime,
            location,
            suspendData,
            interactions,
            objectives
          })
          .returning();
        
        res.json(created[0]);
      }
    } catch (error) {
      console.error("Error saving SCORM data:", error);
      res.status(500).json({ error: "Failed to save SCORM data" });
    }
  });

  // H5P Content API endpoints
  app.get("/api/h5p/content", async (req, res) => {
    try {
      const content = await db.select()
        .from(h5pContent)
        .orderBy(desc(h5pContent.createdAt));
      
      res.json(content);
    } catch (error) {
      console.error("Error fetching H5P content:", error);
      res.status(500).json({ error: "Failed to fetch H5P content" });
    }
  });

  app.post("/api/h5p/track", async (req, res) => {
    try {
      const { title, contentType, content, parameters, tracking } = req.body;
      
      const created = await db.insert(h5pContent)
        .values({
          title,
          contentType,
          content,
          parameters,
          tracking
        })
        .returning();
      
      res.json(created[0]);
    } catch (error) {
      console.error("Error saving H5P content:", error);
      res.status(500).json({ error: "Failed to save H5P content" });
    }
  });

  // Course Progress API endpoints
  app.get("/api/courses/progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      const progress = await db.select({
        courseId: enrollments.courseId,
        progress: enrollments.progress,
        enrolledAt: enrollments.enrolledAt,
        completedAt: enrollments.completedAt,
        courseTitle: courses.title,
        courseDescription: courses.description
      })
      .from(enrollments)
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, parseInt(userId)))
      .orderBy(desc(enrollments.enrolledAt));
      
      res.json(progress);
    } catch (error) {
      console.error("Error fetching course progress:", error);
      res.status(500).json({ error: "Failed to fetch course progress" });
    }
  });

  app.post("/api/courses/progress", async (req, res) => {
    try {
      const { userId, courseId, progress } = req.body;
      
      // Check if enrollment exists
      const existing = await db.select()
        .from(enrollments)
        .where(eq(enrollments.userId, userId))
        .where(eq(enrollments.courseId, courseId))
        .limit(1);

      if (existing.length > 0) {
        // Update progress
        const updated = await db.update(enrollments)
          .set({
            progress,
            completedAt: progress >= 100 ? new Date() : null
          })
          .where(eq(enrollments.id, existing[0].id))
          .returning();
        
        res.json(updated[0]);
      } else {
        // Create new enrollment
        const created = await db.insert(enrollments)
          .values({
            userId,
            courseId,
            progress,
            completedAt: progress >= 100 ? new Date() : null
          })
          .returning();
        
        res.json(created[0]);
      }
    } catch (error) {
      console.error("Error updating course progress:", error);
      res.status(500).json({ error: "Failed to update course progress" });
    }
  });

  // Dashboard LMS API endpoint
  app.get("/api/lms/dashboard", async (req, res) => {
    try {
      // Get real data from database
      const totalCourses = await db.select().from(courses);
      const totalEnrollments = await db.select().from(enrollments);
      const scormRecords = await db.select().from(scormData);
      
      const activeCourses = totalCourses.filter(course => course.published);
      const completedEnrollments = totalEnrollments.filter(enrollment => enrollment.completedAt);
      
      const completionRate = totalEnrollments.length > 0 
        ? Math.round((completedEnrollments.length / totalEnrollments.length) * 100) 
        : 0;
      
      const averageProgress = totalEnrollments.length > 0
        ? Math.round(totalEnrollments.reduce((sum, enrollment) => sum + (enrollment.progress || 0), 0) / totalEnrollments.length)
        : 0;

      // Get recent activity from SCORM data and enrollments
      const recentActivity = [
        ...scormRecords.slice(0, 5).map(record => ({
          id: record.id,
          student: "Usuario",
          course: `Curso ${record.courseId}`,
          action: record.lessonStatus === 'completed' ? 'completed' : 'progress',
          timestamp: record.updatedAt ? new Date(record.updatedAt).toLocaleString() : 'Reciente',
          progress: Math.round(parseFloat(record.score || '0'))
        })),
        ...totalEnrollments.slice(0, 3).map(enrollment => ({
          id: enrollment.id,
          student: "Estudiante",
          course: `Curso ${enrollment.courseId}`,
          action: enrollment.completedAt ? 'completed' : 'enrolled',
          timestamp: enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleString() : 'Reciente',
          progress: Math.round(enrollment.progress || 0)
        }))
      ].slice(0, 5);

      // Get top courses based on enrollments
      const coursesWithEnrollments = await Promise.all(
        totalCourses.map(async (course) => {
          const enrollmentCount = totalEnrollments.filter(e => e.courseId === course.id).length;
          const avgProgress = totalEnrollments
            .filter(e => e.courseId === course.id)
            .reduce((sum, e) => sum + (e.progress || 0), 0) / (enrollmentCount || 1);
          
          return {
            id: course.id,
            name: course.title,
            students: enrollmentCount,
            completionRate: Math.round(avgProgress),
            averageRating: 4.5 + Math.random() * 0.5 // Simulated rating
          };
        })
      );

      const topCourses = coursesWithEnrollments
        .sort((a, b) => b.students - a.students)
        .slice(0, 5);

      const dashboardData = {
        totalCourses: totalCourses.length,
        activeCourses: activeCourses.length,
        totalStudents: new Set(totalEnrollments.map(e => e.userId)).size,
        activeStudents: new Set(scormRecords.map(s => s.userId)).size,
        completionRate,
        averageProgress,
        totalModules: scormRecords.length,
        completedModules: scormRecords.filter(s => s.lessonStatus === 'completed').length,
        recentActivity,
        topCourses,
        monthlyProgress: [
          { month: "Jun", enrollments: totalEnrollments.length, completions: completedEnrollments.length }
        ]
      };

      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
