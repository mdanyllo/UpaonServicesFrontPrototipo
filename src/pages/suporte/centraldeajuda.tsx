import Header from "@/components/layout/Header";


export function CentralDeAjuda() {
return (
<>
    <Header />
    <section className="min-h-screen bg-gradient-sunset pt-28 px-4">
        <div className="container mx-auto max-w-4xl bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-large">
            <h1 className="font-display font-bold text-3xl mb-4">Central de Ajuda</h1>
            <p className="text-muted-foreground mb-6">
            Estamos aqui para ajudar você a utilizar o Upaon Services da melhor forma possível.
            </p>


        <div className="space-y-4 text-muted-foreground">
            <p><strong>🔍 Como encontrar profissionais?</strong><br />Utilize a barra de busca ou navegue pelas categorias disponíveis.</p>
            <p><strong>📞 Contato com prestadores</strong><br />Cada profissional possui informações de contato direto.</p>
            <p><strong>🔒 Segurança</strong><br />Prezamos pela privacidade e segurança dos usuários da plataforma.</p>
        </div>
    </div>
    </section>
</>
);
}