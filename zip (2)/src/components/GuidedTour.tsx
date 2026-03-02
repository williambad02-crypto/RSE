import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useNavigate, useLocation } from 'react-router-dom';

export function GuidedTour() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const startTour = params.get('tour') === 'true';

    if (startTour) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const driverObj = driver({
          showProgress: true,
          animate: true,
          allowClose: true,
          overlayColor: 'rgba(0, 0, 0, 0.75)',
          nextBtnText: 'Suivant',
          prevBtnText: 'Précédent',
          doneBtnText: 'Terminer',
          steps: [
            { 
              element: '#app-sidebar', 
              popover: { 
                title: 'Bienvenue sur votre Espace RSE', 
                description: 'Voici votre menu principal. Il restera toujours accessible ici.',
                side: "right", 
                align: 'start' 
              } 
            },
            { 
              element: '#app-nav a[href="/dashboard"]', 
              popover: { 
                title: 'Tableau de Bord', 
                description: 'Une vue d\'ensemble de votre progression et des indicateurs clés.',
                side: "right", 
                align: 'center' 
              } 
            },
            { 
              element: '#app-nav a[href="/data-entry"]', 
              popover: { 
                title: 'Saisie des Données', 
                description: 'Commencez par ici ! Renseignez votre diagnostic T0 et vos suivis annuels.',
                side: "right", 
                align: 'center' 
              } 
            },
            { 
              element: '#app-nav a[href="/action-plan"]', 
              popover: { 
                title: 'Plan d\'Action', 
                description: 'Définissez et suivez les actions concrètes pour atteindre vos objectifs.',
                side: "right", 
                align: 'center' 
              } 
            },
            { 
              element: '#app-main', 
              popover: { 
                title: 'Zone de Travail', 
                description: 'C\'est ici que vous visualiserez et modifierez vos données.',
                side: "left", 
                align: 'start' 
              } 
            },
            { 
              popover: { 
                title: 'À vous de jouer !', 
                description: 'Commencez par saisir vos données initiales dans l\'onglet "Saisie".' 
              } 
            }
          ],
          onDestroyed: () => {
            // Remove query param cleanly
            navigate(location.pathname, { replace: true });
          }
        });

        driverObj.drive();
      }, 500);
    }
  }, [location.search, navigate, location.pathname]);

  return null;
}
