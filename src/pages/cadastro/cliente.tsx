import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

export function Cliente() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const [acceptTerms, setAcceptTerms] = useState(false)


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phone: formData.get("phone") as string,
      role: "CLIENT",
    }

    try {
      const res = await fetch(
        "https://upaonservicesbackprototipo.onrender.com/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      )

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Erro ao criar conta")
      }

      if (!acceptTerms) {
      setError("Você precisa aceitar os Termos de Uso para continuar.")
      return
      }

      navigate("/")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-sunset px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-sun/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-card/90 backdrop-blur-sm border border-border rounded-2xl shadow-large p-8 space-y-6 animate-fade-in"
      >
        <div className="text-center">
          <h1 className="font-display font-bold text-3xl text-foreground">
            Criar conta na{" "}
            <span className="text-gradient-hero">UpaonServices</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Encontre profissionais de confiança perto de você
          </p>
        </div>

        <div className="space-y-4">
          <Input
            name="name"
            placeholder="Nome completo"
            required
            className="rounded-xl"
          />

          <Input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="rounded-xl"
          />

          <Input
            name="phone"
            placeholder="Telefone (opcional)"
            className="rounded-xl"
          />

          <Input
            name="password"
            type="password"
            placeholder="Senha"
            required
            className="rounded-xl"
          />
        </div>

        <div className="flex items-start gap-2 mt-4">
          <input
            id="terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />

          <label htmlFor="terms" className="text-sm text-muted-foreground">
            Li e concordo com os{" "}
            <a
              href="/suporte/termosdeuso"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a
              href="/suporte/politicadeprivacidade"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Política de Privacidade
            </a>
          </label>
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="hero"
          size="lg"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Criando conta..." : "Cadastrar como cliente"}
        </Button>
      </form>
    </section>
  )
}
