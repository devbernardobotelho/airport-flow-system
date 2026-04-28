export function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Configurações</h1>
                <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Configurações Gerais</h3>
                        <p className="text-sm text-muted-foreground">
                            Configurações do sistema em desenvolvimento...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
