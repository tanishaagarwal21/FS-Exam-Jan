"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import type React from "react" // Added import for React

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isLogin }),
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem("token", data.token)
        toast({
          title: isLogin ? "Logged in successfully" : "Signed up successfully",
          description: "You can now start creating notes.",
        })
        // TODO: Redirect to notes page or refresh the component
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // ... rest of the component remains the same
}

