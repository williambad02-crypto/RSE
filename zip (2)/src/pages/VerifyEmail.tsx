import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { CheckCircle, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  const verifyToken = async (token: string) => {
    setStatus('LOADING');
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
        credentials: 'include',
      });

      if (response.ok) {
        setStatus('SUCCESS');
        // Redirect to onboarding after 2 seconds with tour parameter
        setTimeout(() => {
          navigate('/onboarding?tour=true');
        }, 2000);
      } else {
        const data = await response.json();
        setStatus('ERROR');
        setMessage(data.error || 'Lien invalide ou expiré.');
      }
    } catch (error) {
      setStatus('ERROR');
      setMessage('Erreur de connexion.');
    }
  };

  if (token) {
    // Verification Mode
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              {status === 'LOADING' ? <Loader2 className="h-6 w-6 animate-spin" /> : 
               status === 'SUCCESS' ? <CheckCircle className="h-6 w-6 text-green-600" /> :
               <AlertCircle className="h-6 w-6 text-red-600" />}
            </div>
            <CardTitle>Vérification de l'email</CardTitle>
            <CardDescription>
              {status === 'LOADING' && 'Validation de votre compte en cours...'}
              {status === 'SUCCESS' && 'Compte vérifié avec succès ! Redirection...'}
              {status === 'ERROR' && message}
            </CardDescription>
          </CardHeader>
          {status === 'ERROR' && (
            <CardContent>
              <Link to="/login">
                <Button variant="outline">Retour à la connexion</Button>
              </Link>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  // Instructions Mode (After Registration)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Mail className="h-6 w-6" />
          </div>
          <CardTitle>Vérifiez vos emails</CardTitle>
          <CardDescription>
            Un lien de confirmation a été envoyé à votre adresse email.
            Veuillez cliquer dessus pour activer votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-md text-sm text-yellow-800 border border-yellow-200">
            <strong>Note pour la démo :</strong><br/>
            Le lien de vérification est affiché dans la console du serveur (terminal).
            <br/>
            Assurez-vous que le domaine correspond à celui de cette fenêtre (l'URL de l'application).
          </div>
          <Link to="/login">
            <Button variant="ghost">Retour à la connexion</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
