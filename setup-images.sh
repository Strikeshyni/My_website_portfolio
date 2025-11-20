#!/bin/bash

# Script pour créer la structure de dossiers d'images
# Ce script crée les dossiers nécessaires pour les images du portfolio

echo "📁 Création de la structure de dossiers pour les images..."

# Créer le dossier principal
mkdir -p public/images/projects

echo "✅ Structure créée :"
echo "   public/"
echo "   └── images/"
echo "       └── projects/"
echo ""
echo "📝 Ajoutez maintenant vos images :"
echo ""
echo "   public/images/avatar.jpg (400x400px)"
echo "   public/images/projects/sudoku.jpg (800x600px)"
echo "   public/images/projects/sudoku-banner.jpg (1920x600px)"
echo "   public/images/projects/chatbot.jpg (800x600px)"
echo "   public/images/projects/chatbot-banner.jpg (1920x600px)"
echo "   public/images/projects/portfolio.jpg (800x600px)"
echo "   public/images/projects/portfolio-banner.jpg (1920x600px)"
echo ""
echo "💡 Astuce : Vous pouvez utiliser des placeholders depuis unsplash.com ou"
echo "   des outils comme Canva pour créer vos images temporaires."
echo ""
echo "🎨 Dimensions recommandées :"
echo "   - Avatar : 400x400px (carré)"
echo "   - Miniatures : 800x600px (paysage)"
echo "   - Bannières : 1920x600px (ultra-large)"
echo ""
echo "✨ Prêt à ajouter vos images !"
