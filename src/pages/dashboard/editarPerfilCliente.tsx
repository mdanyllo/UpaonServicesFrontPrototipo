import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Camera, Save, User, Mail, Loader2, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" 

export function EditProfileCliente() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Estados de Carregamento e Dados
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Estados do Formulário
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("São Luís - MA") // Valor padrão
  const [neighborhood, setNeighborhood] = useState("")
  
  // Estados da Imagem
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // 1. Carrega os dados do Cliente
  useEffect(() => {
    const storedUser = localStorage.getItem("upaon_user")
    const storedToken = localStorage.getItem("upaon_token")

    if (!storedUser || !storedToken) {
      navigate("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)

      // Se for prestador tentando acessar, manda pro edit dele
      if (parsedUser.role === "PROVIDER") {
        navigate("/dashboard/editarperfil")
        return
      }

      setUser(parsedUser)
      
      // Preenche campos
      setPhone(parsedUser.phone || "")
      setCity(parsedUser.city || "São Luís - MA")
      setNeighborhood(parsedUser.neighborhood || "")
      setPreviewUrl(parsedUser.avatarUrl || null)
      
      setIsLoading(false)

    } catch (error) {
      console.error("Erro ao processar usuário", error)
      localStorage.clear()
      navigate("/login")
    }
  }, [navigate])
  
  // 2. Máscara de Telefone
  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value
    value = value.replace(/\D/g, "")
    if (value.length > 11) value = value.slice(0, 11)
    
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`
    }
    if (value.length > 9) {
      value = `${value.slice(0, 9)}-${value.slice(9)}`
    }
    setPhone(value)
  }

  // 3. Preview da Imagem
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  // 4. Salvar
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      const token = localStorage.getItem("upaon_token")
      const formData = new FormData()

      // Envia os campos atualizados
      formData.append("phone", phone)
      formData.append("city", city)
      formData.append("neighborhood", neighborhood)
      
      if (selectedFile) {
        formData.append("avatar", selectedFile)
      }

      // Usa a mesma rota de atualização de perfil
      const res = await fetch("https://upaonservicesbackprototipo.onrender.com/users/profile", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error("Erro ao atualizar perfil")

      const updatedUser = await res.json()
      
      // Atualiza o localStorage com os novos dados (incluindo bairro e cidade)
      localStorage.setItem("upaon_user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      // Volta para o Dashboard
      navigate("/dashboard/cliente")

    } catch (error) {
      console.error(error)
      alert("Erro ao salvar perfil. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-sunset">
            <div className="animate-spin text-primary">
                <Loader2 className="w-10 h-10" />
            </div>
        </div>
    )
  }

  if (!user) return null

  return (
    <section className="relative min-h-screen py-12 bg-gradient-sunset overflow-hidden flex items-center justify-center px-4">
      
      {/* Background Animado */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-ocean/20 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      {/* Card Principal */}
      <div className="relative z-10 w-full max-w-2xl bg-card/80 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header do Card */}
        <div className="px-8 py-6 border-b border-border/50 flex items-center gap-4 bg-white/5">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/dashboard/cliente")} 
            className="rounded-full hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Editar Meu Perfil</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* --- FOTO DE PERFIL --- */}
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 rounded-full border-4 border-card bg-muted flex items-center justify-center overflow-hidden shadow-lg transition-transform group-hover:scale-105">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-muted-foreground/50" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors">
                <Camera className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground font-medium">Toque para alterar a foto</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* --- CAMPOS READ-ONLY --- */}
            <div className="space-y-2 opacity-70">
              <label className="text-sm font-medium text-muted-foreground ml-1">Nome</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 border border-border">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium truncate">{user.name}</span>
              </div>
            </div>

            <div className="space-y-2 opacity-70">
              <label className="text-sm font-medium text-muted-foreground ml-1">E-mail</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 border border-border">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium truncate">{user.email}</span>
              </div>
            </div>

            {/* --- CAMPOS EDITÁVEIS --- */}
            
            {/* TELEFONE */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-foreground ml-1">Celular / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(98) 99999-0000"
                  className="pl-10 rounded-xl bg-card/50"
                  maxLength={15}
                  required
                />
              </div>
            </div>

            {/* BAIRRO (Importante para busca) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Bairro</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Cohab, Renascença..."
                  className="pl-10 rounded-xl bg-card/50"
                  required
                />
              </div>
            </div>

            {/* CIDADE */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Cidade</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: São Luís - MA"
                  className="pl-10 rounded-xl bg-card/50"
                  required
                />
              </div>
            </div>

          </div>

          {/* Footer com Ações */}
          <div className="flex items-center gap-4 pt-4 border-t border-border/50">
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full rounded-xl"
              onClick={() => navigate("/dashboard/cliente")}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="hero" 
              className="w-full rounded-xl shadow-lg shadow-primary/20"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                </>
              )}
            </Button>
          </div>

        </form>
      </div>
    </section>
  )
}