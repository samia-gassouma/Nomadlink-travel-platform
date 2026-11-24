import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutsModule } from 'src/app/back-office/layouts/layouts.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduitService } from 'src/app/front-office/services/boutique/produit/produit.service';
import Swal from 'sweetalert2';
import { AiService } from 'src/app/front-office/services/boutique/metiersAvancés/ai.service';

interface Category {
  id: number;
  name: string;
}

interface ProductImage {
  file: File;
  preview: string | ArrayBuffer;
}
@Component({
  selector: 'app-addproduit',
  standalone: true,
  imports: [
     CommonModule, 
     FormsModule, 
     RouterModule,
     LayoutsModule,
     ReactiveFormsModule
 ],
  templateUrl: './addproduit.component.html',
  styleUrl: './addproduit.component.scss'
})

export class AddproduitComponent implements OnInit{
  isSidebarHidden: boolean = false;
  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  productForm: FormGroup;
  images: ProductImage[] = [];
  maxImages = 5;
  isDragging = false;
  categories: Category[] = [
    { id: 1, name: 'Électronique' },
    { id: 2, name: 'Vêtements' },
    { id: 3, name: 'Alimentation' },
    { id: 4, name: 'Maison' },
    { id: 5, name: 'Sport' }
  ];
  resumeText: string = '';
  ideesText: string = '';
  correctionText: string = '';
  isLoadingAI: boolean = false;
  productIdeas: string[] = [];

  constructor(private fb: FormBuilder, private productService: ProduitService, private aiService: AiService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      category: ['', Validators.required],
      images: [[]]
    });
  }

  ngOnInit(): void {}

  // Gestion de l'événement DragOver
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  // Gestion de l'événement DragLeave
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  // Gestion du dépôt des fichiers
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  // Gestion de la sélection des fichiers
  onImagesSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      this.handleFiles(files);
    }
  }

  // Gestion des fichiers et des validations
  private handleFiles(files: FileList): void {
    // Vérification du nombre total d'images
    if (this.images.length + files.length > this.maxImages) {
      alert(`Vous ne pouvez pas ajouter plus de ${this.maxImages} images`);
      return;
    }

    Array.from(files).forEach(file => {
      // Vérification de la taille du fichier (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 2MB');
        return;
      }

      // Vérification du type de fichier
      if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
        alert('Seuls les formats JPG et PNG sont acceptés');
        return;
      }

      // Création de la prévisualisation
      const reader = new FileReader();
      reader.onload = () => {
        this.images.push({
          file: file,
          preview: reader.result as string
        });
        this.updateFormImages();
      };
      reader.readAsDataURL(file);
    });
  }

  // Supprimer une image
  removeImage(index: number): void {
    this.images.splice(index, 1);
    this.updateFormImages();
  }

  // Mettre à jour les images dans le formulaire
  private updateFormImages(): void {
    this.productForm.patchValue({
      images: this.images.map(img => img.file)
    });
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.productForm.valid) {
        const formData = new FormData();

        // Crée une partie 'produit' contenant les informations du produit
        formData.append('produit', JSON.stringify({
          nom: this.productForm.get('name')?.value,          // ✅ nom (pas name)
          prix: this.productForm.get('price')?.value,        // ✅ prix (pas price)
          description: this.productForm.get('description')?.value,
          stock: this.productForm.get('stock')?.value,
          categorie: this.productForm.get('category')?.value // ✅ categorie (pas category)
        }));

        // Ajoute les images à la partie 'images'
        this.images.forEach((image) => {
            formData.append('images', image.file, image.file.name);
        });

        // L'en-tête Content-Type est automatiquement géré par FormData
        this.productService.addProduct(formData).subscribe(
            response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Produit ajouté',
                    text: 'Le produit a été ajouté avec succès !',
                    confirmButtonText: 'OK'
                });

                this.productForm.reset(); // Réinitialiser le formulaire
                this.images = []; // Vider les images
            },
            error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de l\'ajout du produit.',
                    confirmButtonText: 'Réessayer'
                });
            }
        );
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Formulaire incomplet',
            text: 'Merci de remplir tous les champs obligatoires.',
            confirmButtonText: 'OK'
        });
    }
}
generateIdeesProduit() {
  this.isLoadingAI = true;

  const category = this.productForm.get('category')?.value;
  const description = this.productForm.get('description')?.value || '';

  console.log('📤 Données envoyées :', { theme: category, description });  // AJOUT IMPORTANT

  this.aiService.ideesProduit(category, description).subscribe({
    next: (response: string[]) => {
      this.productIdeas = response;
      this.isLoadingAI = false;
    },
    error: (error) => {
      console.error('⛔ Erreur complète :', error);  // Montre TOUTE l’erreur
      Swal.fire({
        icon: 'error',
        title: 'Erreur IA',
        text: error.error || 'Erreur inconnue lors de la génération des idées.',
      });
      this.isLoadingAI = false;
    }
  });
}





corrigerDescription(): void {
  const description = this.productForm.get('description')?.value;
  if (!description) return;

  this.isLoadingAI = true;
  this.aiService.corriger(description).subscribe({
    next: (res: string) => {
      this.productForm.get('description')?.setValue(res);
      this.correctionText = res;
      this.isLoadingAI = false;
    },
    error: () => {
      Swal.fire('Erreur', 'La correction a échoué.', 'error');
      this.isLoadingAI = false;
    }
  });
}

resumerDescription(): void {
  const description = this.productForm.get('description')?.value;
  if (!description) return;

  this.isLoadingAI = true;
  this.aiService.resumer(description).subscribe({
    next: (res: string) => {
      this.resumeText = res;
      this.isLoadingAI = false;
    },
    error: () => {
      Swal.fire('Erreur', 'Le résumé a échoué.', 'error');
      this.isLoadingAI = false;
    }
  });
}


}
