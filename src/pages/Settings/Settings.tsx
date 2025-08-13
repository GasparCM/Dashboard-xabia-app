import React, { useState, useEffect } from "react";
import {
  Save,
  Upload,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Palette,
  Bot,
} from "lucide-react";
import { Card } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { mockAPI } from "../../mocks/data";
import { Settings as SettingsType } from "../../types";
import { usePermissions } from "../../store/AppContext";
import toast from "react-hot-toast";

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("branding");
  const permissions = usePermissions();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await mockAPI.getSettings();
        setSettings(data);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = () => {
    toast.success("Configuración guardada correctamente");
  };

  const tabs = [
    { id: "branding", label: "Branding", icon: Palette },
    { id: "home", label: "Bloques Home", icon: Eye },
    { id: "translations", label: "Traducciones", icon: Globe },
    { id: "ai", label: "IA Provider", icon: Bot },
  ];

  if (loading || !settings) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded-card"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-text-title-strong text-lg font-medium">
            Configuración del Sistema
          </h2>
          <p className="text-text-body mt-1">
            Gestiona la configuración global de Xàbia App
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button icon={Save} onClick={handleSave}>
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "text-text-body hover:bg-gray-50 hover:text-text-title"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "branding" && (
            <Card>
              <h3 className="text-text-title-strong font-medium mb-6">
                Configuración de Marca
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-title mb-2">
                    Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={settings.branding.logo}
                      alt="Logo actual"
                      className="w-16 h-16 object-cover rounded-lg border border-border"
                    />
                    <div>
                      <Button variant="outline" icon={Upload} size="sm">
                        Cambiar Logo
                      </Button>
                      <p className="text-xs text-text-body mt-1">
                        Recomendado: 200x200px, formato PNG o SVG
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-title mb-2">
                    Título de la Aplicación
                  </label>
                  <input
                    type="text"
                    value={settings.branding.title}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        branding: {
                          ...settings.branding,
                          title: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </Card>
          )}

          {activeTab === "home" && (
            <Card>
              <h3 className="text-text-title-strong font-medium mb-6">
                Bloques de la Página Principal
              </h3>
              <div className="space-y-4">
                {settings.homeBlocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-text-body">#{block.order}</span>
                        <h4 className="font-medium text-text-title-strong">
                          {block.title}
                        </h4>
                        <span className="px-2 py-1 bg-gray-100 text-xs rounded-full text-text-body">
                          {block.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const newBlocks = [...settings.homeBlocks];
                          newBlocks[index].isActive =
                            !newBlocks[index].isActive;
                          setSettings({ ...settings, homeBlocks: newBlocks });
                        }}
                        className={`p-2 rounded-lg ${
                          block.isActive ? "text-success" : "text-text-body"
                        }`}
                      >
                        {block.isActive ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <Button variant="outline" size="sm" icon={Trash2}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" icon={Plus} className="w-full">
                  Añadir Bloque
                </Button>
              </div>
            </Card>
          )}

          {activeTab === "translations" && (
            <Card>
              <h3 className="text-text-title-strong font-medium mb-6">
                Gestión de Traducciones
              </h3>
              <div className="space-y-6">
                <div className="flex space-x-4 border-b border-border">
                  {Object.keys(settings.translations).map((lang) => (
                    <button
                      key={lang}
                      className="px-4 py-2 border-b-2 border-transparent hover:border-primary text-text-body hover:text-primary uppercase font-medium"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                  {Object.entries(settings.translations.es).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-4 gap-4 items-center"
                      >
                        <div className="font-mono text-sm text-text-body">
                          {key}
                        </div>
                        <input
                          type="text"
                          value={settings.translations.es[key]}
                          className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Español"
                        />
                        <input
                          type="text"
                          value={settings.translations.va[key] || ""}
                          className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Valencià"
                        />
                        <input
                          type="text"
                          value={settings.translations.en[key] || ""}
                          className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="English"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </Card>
          )}

          {activeTab === "ai" && (
            <Card>
              <h3 className="text-text-title-strong font-medium mb-6">
                Configuración de IA
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-title mb-2">
                    Proveedor de IA
                  </label>
                  <select
                    value={settings.aiProvider}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        aiProvider: e.target.value as "deepseek" | "gemini",
                      })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="deepseek">DeepSeek</option>
                    <option value="gemini">Google Gemini</option>
                  </select>
                  <p className="text-xs text-text-body mt-1">
                    Selecciona el proveedor de IA para funciones automáticas
                    (solo UI)
                  </p>
                </div>
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Bot className="w-5 h-5 text-warning mt-0.5" />
                    <div>
                      <h4 className="font-medium text-warning mb-1">
                        Configuración Solo UI
                      </h4>
                      <p className="text-sm text-text-body">
                        Esta configuración es solo para demostración. En un
                        entorno real, aquí se configurarían las claves API y
                        parámetros del proveedor de IA.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
