import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Upload, AlertCircle, FileJson, CheckCircle } from 'lucide-react';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { storageService } from '../../services/storage';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

interface StepImportProps {
  onBack: () => void;
}

export function StepImport({ onBack }: StepImportProps) {
  const navigate = useNavigate();
  const { importData } = useAppStore();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/json' && !selectedFile.name.endsWith('.json')) {
        setError('Le fichier doit être au format JSON.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const data = await storageService.importFromJson(file);
      importData(data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erreur lors de l\'importation du fichier.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div 
        className={`border-2 border-dashed rounded-xl p-8 transition-colors ${
          file ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <input 
          type="file" 
          accept=".json" 
          className="hidden" 
          id="file-upload"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
          {success ? (
            <CheckCircle className="h-12 w-12 text-green-500 animate-in zoom-in" />
          ) : (
            <Upload className={`h-12 w-12 ${file ? 'text-primary' : 'text-gray-400'}`} />
          )}
          
          <div className="space-y-1">
            <p className="font-medium text-gray-900">
              {file ? file.name : 'Cliquez pour sélectionner un fichier'}
            </p>
            <p className="text-sm text-muted-foreground">
              {file ? `${(file.size / 1024).toFixed(2)} KB` : 'Format JSON uniquement'}
            </p>
          </div>
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3 text-sm text-left animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-3 text-sm text-left animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <p>Import réussi ! Redirection en cours...</p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} disabled={loading || success}>
          Retour
        </Button>
        <Button onClick={handleImport} disabled={!file || loading || success}>
          {loading ? 'Importation...' : 'Importer et démarrer'}
        </Button>
      </div>
    </div>
  );
}
