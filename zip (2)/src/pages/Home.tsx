import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Target, BarChart2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b py-4 px-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Target className="h-5 w-5" />
          </div>
          <span>RSE Manager</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost">Se connecter</Button>
          </Link>
          <Link to="/register">
            <Button>Commencer gratuitement</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-6 text-center max-w-5xl mx-auto space-y-8">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Pilotez votre démarche RSE <br />
            <span className="text-primary">simplement et efficacement.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            L'outil tout-en-un pour structurer, mesurer et améliorer votre impact social et environnemental. Conforme ISO 26000.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button size="lg" className="h-12 px-8 text-lg">
                Créer un compte entreprise <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Target}
              title="Stratégie Claire"
              description="Définissez vos axes prioritaires et vos objectifs à long terme (Tf) basés sur un diagnostic initial (T0)."
            />
            <FeatureCard 
              icon={BarChart2}
              title="Indicateurs Précis"
              description="Suivez plus de 50 indicateurs quantitatifs et qualitatifs pour mesurer votre progression réelle."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Données Sécurisées"
              description="Vos données sont stockées de manière sécurisée et accessibles uniquement par votre équipe."
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 border-t">
        &copy; {new Date().getFullYear()} RSE Manager. Tous droits réservés.
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
