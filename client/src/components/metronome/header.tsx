import { HeartPulse, Moon, Sun, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { metronomeStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import type { MetronomeSettings } from "../../types";

interface HeaderProps {
  currentSettings: MetronomeSettings;
}

export function Header({ currentSettings }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleSaveProfile = () => {
    try {
      metronomeStorage.savePreset({
        name: `Custom Profile ${new Date().toLocaleDateString()}`,
        description: `${currentSettings.bpm} BPM • Custom settings`,
        ...currentSettings,
      });
      
      toast({
        title: "Profile saved",
        description: "Your current settings have been saved as a new preset.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="bg-white dark:bg-primary-800 shadow-sm border-b border-primary-200 dark:border-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
              <HeartPulse className="text-white text-lg" size={20} data-testid="logo-icon" />
            </div>
            <h1 className="text-xl font-bold text-primary-900 dark:text-primary-50" data-testid="app-title">
              PulseBeat
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-primary-100 dark:bg-primary-700 hover:bg-primary-200 dark:hover:bg-primary-600 transition-colors duration-200"
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="text-primary-600" size={18} />
              ) : (
                <Sun className="text-primary-300" size={18} />
              )}
            </Button>
            
            {/* Save Profile */}
            <Button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium transition-colors duration-200"
              data-testid="button-save-profile"
            >
              <Save className="mr-2" size={16} />
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
