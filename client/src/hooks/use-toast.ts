import { useState, useEffect } from "react"

type ToastType = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

let toastCount = 0

function generateId() {
  return (++toastCount).toString()
}

const toastState = {
  toasts: [] as ToastType[],
  listeners: [] as Array<(toasts: ToastType[]) => void>,
}

function addToast(toast: Omit<ToastType, "id">) {
  const id = generateId()
  const newToast = { ...toast, id }
  toastState.toasts.push(newToast)
  toastState.listeners.forEach(listener => listener([...toastState.toasts]))
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(id)
  }, 5000)
  
  return newToast
}

function removeToast(id: string) {
  toastState.toasts = toastState.toasts.filter(toast => toast.id !== id)
  toastState.listeners.forEach(listener => listener([...toastState.toasts]))
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>(toastState.toasts)

  useEffect(() => {
    toastState.listeners.push(setToasts)
    return () => {
      const index = toastState.listeners.indexOf(setToasts)
      if (index > -1) {
        toastState.listeners.splice(index, 1)
      }
    }
  }, [])

  const toast = (props: Omit<ToastType, "id">) => addToast(props)

  return {
    toasts,
    toast,
    dismiss: removeToast,
  }
}

export const toast = (props: Omit<ToastType, "id">) => addToast(props)
