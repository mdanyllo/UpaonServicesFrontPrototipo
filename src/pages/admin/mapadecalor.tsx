import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from "react-leaflet"
import { Map as MapIcon, Users, HardHat, ShieldAlert, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { API_URL } from "@/config/api"
import "leaflet/dist/leaflet.css"
import { toast } from "sonner"

// Configuração de cores do Design System
const COLORS = {
  PROVIDER: "#f97316", // Laranja
  CLIENT: "#3b82f6",   // Azul
}

export function MapaCalorAdmin() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<any[]>([]) // Garante que começa como array
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. PEGA DADOS DO LOCALSTORAGE
    const storedUser = localStorage.getItem("upaon_user")
    const token = localStorage.getItem("upaon_token") // Certifique-se que o nome da chave está correto
    
    const parsedUser = storedUser ? JSON.parse(storedUser) : null

    // 2. VALIDAÇÃO DE ADMIN
    if (!parsedUser || parsedUser.role !== "ADMIN" || !token) {
      console.error("Acesso negado ou Token ausente")
      navigate("/login")
      return // Interrompe a execução aqui
    }

    async function fetchMapData() {
      try {
        const res = await fetch(`${API_URL}/admin/heatmap`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Envia o token para resolver o erro 401
          }
        })

        if (!res.ok) {
           throw new Error(`Erro API: ${res.status}`)
        }

        const data = await res.json()

        if (Array.isArray(data)) {
          setUsers(data)
        } else {
          setUsers([]) // Se não for array, reseta para não quebrar o .map()
        }

      } catch (err) {
        console.error("Erro ao carregar dados do mapa:", err)
        setUsers([]) 
      } finally {
        // ESSA LINHA DESTRAVA A TELA
        setLoading(false) 
      }
    }

    fetchMapData()
  }, [navigate])

  if (loading) return <div className="flex h-screen items-center justify-center">Carregando mapa...</div>

  return (
    <div className="flex flex-col h-screen bg-background">

      {/* HEADER DO ADMIN */}
      <header className="border-b bg-p px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <div className="flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Mapa de Calor</h1>
          </div>
        </div>

        {/* LEGENDA RÁPIDA */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="w-3 h-3 rounded-full bg-[#f97316]" /> Prestadores
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="w-3 h-3 rounded-full bg-[#3b82f6]" /> Clientes
          </div>
        </div>
      </header>

      {/* ÁREA DO MAPA */}
      <main className="flex-1 relative">
        <MapContainer 
          center={[-2.5307, -44.3068]} // Centro de São Luís
          zoom={12} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <ZoomControl position="bottomright" />

          {users.map((user) => (
            <CircleMarker
              key={user.id}
              center={[user.latitude, user.longitude]}
              radius={user.role === 'PROVIDER' ? 8 : 6}
              pathOptions={{
                fillColor: user.role === 'PROVIDER' ? COLORS.PROVIDER : COLORS.CLIENT,
                color: "#ffffff",
                weight: 2,
                fillOpacity: 0.7,
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1 space-y-1">
                  <div className="flex items-center gap-2 border-b pb-1 mb-1">
                    {user.role === 'PROVIDER' ? <HardHat className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                    <span className="font-bold">{user.name}</span>
                  </div>
                  <p className="text-xs uppercase font-semibold text-muted-foreground">{user.role}</p>
                  <p className="text-xs">📍 {user.neighborhood || 'Bairro não inf.'}</p>
                  <p className="text-xs">🏘️ {user.city}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* WIDGET DE ESTATÍSTICAS FLUTUANTE */}
        <div className="absolute top-4 left-4 z-[1000] bg-card/90 backdrop-blur border p-4 rounded-xl shadow-2xl space-y-3 w-48">
          <h3 className="text-xs font-bold uppercase text-muted-foreground">Resumo da Rede</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm">Total:</span>
            <span className="font-bold">{users.length}</span>
          </div>
          <div className="flex justify-between items-center text-orange-600">
            <span className="text-sm font-medium text-orange-600">Prestadores:</span>
            <span className="font-bold text-orange-600">
              {users.filter(u => u.role === 'PROVIDER').length}
            </span>
          </div>
          <div className="flex justify-between items-center text-blue-600">
            <span className="text-sm font-medium text-blue-600">Clientes:</span>
            <span className="font-bold text-blue-600">
              {users.filter(u => u.role === 'CLIENT').length}
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}