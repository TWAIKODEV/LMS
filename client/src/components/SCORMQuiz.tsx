import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target, 
  BarChart3,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { useSCORM } from './SCORMTracker';

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'multiple-select' | 'true-false' | 'fill-in';
  question: string;
  options?: string[];
  correctAnswers: string[];
  explanation: string;
  points: number;
}

interface QuizModule {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
  maxAttempts: number;
}

interface SCORMQuizProps {
  module: QuizModule;
  onComplete?: (score: number, passed: boolean) => void;
}

export default function SCORMQuiz({ module, onComplete }: SCORMQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(module.timeLimit ? module.timeLimit * 60 : null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  const { updateProgress, recordInteraction, setLessonStatus, setScore: setSCORMScore } = useSCORM();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (quizStarted && !quizCompleted && timeRemaining !== null && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizStarted, quizCompleted, timeRemaining]);

  const startQuiz = () => {
    setQuizStarted(true);
    setStartTime(new Date());
    setLessonStatus('incomplete');
    
    recordInteraction({
      id: `quiz_start_${module.id}`,
      type: 'choice',
      learner_response: 'quiz_started',
      result: 'correct',
      weighting: 1,
      correct_responses: ['started'],
      latency: '00:00:01'
    });
  };

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    const answerArray = Array.isArray(answer) ? answer : [answer];
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerArray
    }));

    // Record each answer interaction
    recordInteraction({
      id: `question_${questionId}_${Date.now()}`,
      type: 'choice',
      learner_response: answerArray.join(','),
      result: 'neutral',
      weighting: 1,
      correct_responses: module.questions.find(q => q.id === questionId)?.correctAnswers || [],
      latency: '00:00:01'
    });

    // Update progress based on questions answered
    const progress = (Object.keys(answers).length + 1) / module.questions.length * 100;
    updateProgress(module.id, Math.min(progress, 95)); // Keep at 95% until quiz is submitted
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;

    module.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswers = answers[question.id] || [];
      const correctAnswers = question.correctAnswers;

      // Check if answers match
      const isCorrect = userAnswers.length === correctAnswers.length && 
                       userAnswers.every(answer => correctAnswers.includes(answer));

      if (isCorrect) {
        earnedPoints += question.points;
      }
    });

    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  };

  const submitQuiz = () => {
    const finalScore = calculateScore();
    const passed = finalScore >= module.passingScore;
    const endTime = new Date();
    const duration = startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) : 0;

    setScore(finalScore);
    setQuizCompleted(true);
    setShowResults(true);

    // Update SCORM data
    updateProgress(module.id, 100);
    setSCORMScore(finalScore);
    setLessonStatus(passed ? 'passed' : 'failed');

    // Record quiz completion
    recordInteraction({
      id: `quiz_complete_${module.id}`,
      type: 'performance',
      learner_response: `score_${finalScore}`,
      result: passed ? 'correct' : 'incorrect',
      weighting: 1,
      correct_responses: [`${module.passingScore}`],
      latency: `00:${Math.floor(duration / 60).toString().padStart(2, '0')}:${(duration % 60).toString().padStart(2, '0')}`
    });

    onComplete?.(finalScore, passed);
  };

  const retryQuiz = () => {
    if (attemptNumber < module.maxAttempts) {
      setAttemptNumber(prev => prev + 1);
      setAnswers({});
      setCurrentQuestion(0);
      setQuizCompleted(false);
      setShowResults(false);
      setScore(0);
      setTimeRemaining(module.timeLimit ? module.timeLimit * 60 : null);
      setQuizStarted(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = module.questions[currentQuestion];
  const canRetry = attemptNumber < module.maxAttempts && score < module.passingScore;

  if (!quizStarted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            {module.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{module.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-sagardoy-navy">{module.questions.length}</div>
              <div className="text-sm text-gray-600">Preguntas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sagardoy-navy">{module.passingScore}%</div>
              <div className="text-sm text-gray-600">Nota mínima</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sagardoy-navy">{module.maxAttempts}</div>
              <div className="text-sm text-gray-600">Intentos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sagardoy-navy">
                {module.timeLimit ? `${module.timeLimit}min` : 'Sin límite'}
              </div>
              <div className="text-sm text-gray-600">Tiempo</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="outline">Intento {attemptNumber} de {module.maxAttempts}</Badge>
            <Button onClick={startQuiz} className="bg-sagardoy-blue hover:bg-sagardoy-navy">
              <Target className="w-4 h-4 mr-2" />
              Comenzar Evaluación
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const passed = score >= module.passingScore;
    
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Resultados de la Evaluación</span>
            <div className="flex items-center gap-2">
              <Badge variant={passed ? "default" : "destructive"}>
                {passed ? "Aprobado" : "Reprobado"}
              </Badge>
              {passed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {score}%
              </div>
              <div className="text-sm text-gray-600">Puntuación</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sagardoy-navy">{module.passingScore}%</div>
              <div className="text-sm text-gray-600">Requerido</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sagardoy-navy">{attemptNumber}</div>
              <div className="text-sm text-gray-600">Intento</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sagardoy-navy">
                {startTime ? formatTime(Math.round((new Date().getTime() - startTime.getTime()) / 1000)) : '0:00'}
              </div>
              <div className="text-sm text-gray-600">Tiempo</div>
            </div>
          </div>

          {/* Question Review */}
          <div className="space-y-3">
            <h4 className="font-semibold">Revisión de respuestas:</h4>
            {module.questions.map((question, index) => {
              const userAnswers = answers[question.id] || [];
              const isCorrect = userAnswers.length === question.correctAnswers.length && 
                               userAnswers.every(answer => question.correctAnswers.includes(answer));
              
              return (
                <div key={question.id} className="border rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">Pregunta {index + 1}: {question.question}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Tu respuesta: {userAnswers.join(', ') || 'Sin respuesta'}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        Respuesta correcta: {question.correctAnswers.join(', ')}
                      </p>
                      {question.explanation && (
                        <p className="text-sm text-blue-600 mt-2 italic">
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {canRetry && (
            <div className="flex justify-center">
              <Button onClick={retryQuiz} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reintentar Evaluación
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Pregunta {currentQuestion + 1} de {module.questions.length}</span>
          <div className="flex items-center gap-2">
            {timeRemaining !== null && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className={timeRemaining < 300 ? 'text-red-600 font-bold' : ''}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            <Badge variant="outline">
              {Math.round((currentQuestion / module.questions.length) * 100)}% completado
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Progress value={(currentQuestion / module.questions.length) * 100} className="h-2" />
        
        <div>
          <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
          
          {currentQ.type === 'multiple-choice' && (
            <RadioGroup 
              value={answers[currentQ.id]?.[0] || ''}
              onValueChange={(value) => handleAnswer(currentQ.id, value)}
            >
              {currentQ.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQ.type === 'multiple-select' && (
            <div className="space-y-2">
              {currentQ.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`option-${index}`}
                    checked={answers[currentQ.id]?.includes(option) || false}
                    onCheckedChange={(checked) => {
                      const currentAnswers = answers[currentQ.id] || [];
                      const newAnswers = checked 
                        ? [...currentAnswers, option]
                        : currentAnswers.filter(a => a !== option);
                      handleAnswer(currentQ.id, newAnswers);
                    }}
                  />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          )}

          {currentQ.type === 'true-false' && (
            <RadioGroup 
              value={answers[currentQ.id]?.[0] || ''}
              onValueChange={(value) => handleAnswer(currentQ.id, value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Verdadero" id="true" />
                <Label htmlFor="true">Verdadero</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Falso" id="false" />
                <Label htmlFor="false">Falso</Label>
              </div>
            </RadioGroup>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button 
            variant="outline"
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          {currentQuestion === module.questions.length - 1 ? (
            <Button onClick={submitQuiz} className="bg-green-600 hover:bg-green-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Finalizar Evaluación
            </Button>
          ) : (
            <Button 
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              disabled={!answers[currentQ.id]}
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}