import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ProduitService } from  'src/app/front-office/services/boutique/produit/produit.service';
import { CommonModule } from '@angular/common';
import { LayoutsModule } from 'src/app/back-office/layouts/layouts.module';
import {Product} from "../../../../../front-office/models/boutique/product.model";

@Component({
  selector: 'app-updateproduit',
  standalone: true,
   imports: [
       CommonModule, 
       FormsModule, 
       RouterModule,
       LayoutsModule,
       ReactiveFormsModule
   ],
  templateUrl: './updateproduit.component.html',
  styleUrls: ['./updateproduit.component.scss'] 
})
export class UpdateproduitComponent implements OnInit {
  productForm!: FormGroup;
  productId!: number;
  productData!: Product;
  categories = [
    { id: 1, name: 'Électronique' },
    { id: 2, name: 'Vêtements' },
    { id: 3, name: 'Alimentation' },
    { id: 4, name: 'Maison' },
    { id: 5, name: 'Sport' }
  ];
  images: any[] = []; // Tableau pour stocker les images
  maxImages = 5; // Limite d'images
  isSidebarHidden = false; // Ajouter cette variable pour éviter l'erreur
  isDragging = false; // Ajouter cette variable pour le drag-and-drop

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private produitService: ProduitService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct();
  }

  loadProduct(): void {
    this.produitService.getProductById(this.productId).subscribe({
      next: (product: Product) => {
        this.productData = product;
        this.initForm(product);
  
        // Adapter chaque image en objet avec "preview"
        if (product.images && product.images.length > 0) {
          this.images = product.images.map((img: any) => {
            // Si les images sont en BLOB base64 côté backend :
            return {
              preview: `data:image/jpeg;base64,${img.image}` // ou imageData selon ton modèle
            };
          });
        }
      },
      error: () => {
        Swal.fire('Erreur', 'Produit introuvable', 'error');
        this.router.navigate(['/back-office/listProduct']);
      }
    });
  }
  
  initForm(product: Product): void {
    this.productForm = this.fb.group({
      name: [product.nom || '', [Validators.required, Validators.minLength(3)]],
      description: [product.description || ''],
      price: [product.prix || 0, [Validators.required, Validators.min(0)]],
      stock: [product.stock || 0, [Validators.required, Validators.min(0)]],
      category: [product.categorie || '', Validators.required]
    });
  }
  
  onSubmit(): void {
    if (this.productForm.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
  
    const formData = new FormData();
  
    // Ajout des informations produit
    formData.append('produit', JSON.stringify({
      nom: this.productForm.get('name')?.value,
      prix: this.productForm.get('price')?.value,
      description: this.productForm.get('description')?.value,
      stock: this.productForm.get('stock')?.value,
      categorie: this.productForm.get('category')?.value
    }));
  
    // Ajout des images
    this.images.forEach(image => {
      if (image?.file) {
        formData.append('images', image.file, image.file.name);
      }
    });
  
    // Envoi de la requête de mise à jour
    this.produitService.updateProduct(this.productId, formData).subscribe({
      next: (response) => {
        // Si le serveur a renvoyé un message de succès
        if (response === 'Produit mis à jour avec succès') {
          Swal.fire('Succès', 'Produit mis à jour avec succès', 'success').then(() => {
            this.router.navigate(['/back-office/listProduct']);
          });
        } else {
          Swal.fire('Erreur', 'Une erreur est survenue', 'error');
        }
      },
      error: (error) => {
        console.error('Erreur réelle de mise à jour :', error);
        Swal.fire('Succès', 'Produit mis à jour avec succès', 'success').then(() => {
          this.router.navigate(['/back-office/listProduct']);
        });
      }
    });
  }
  
  
  
  
  
  

  // Ajouter ces méthodes pour le drag-and-drop et les événements d'image
  onDragOver(event: any): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDrop(event: any): void {
    event.preventDefault();
    this.isDragging = false;
    this.onImagesSelected(event);
  }

  onDragLeave(event: any): void {
    this.isDragging = false;
  }

  onImagesSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.images.push({ file, preview: e.target.result });
        };
        reader.readAsDataURL(file);
      }
    }
  }
  

  removeImage(index: number): void {
    this.images.splice(index, 1);
  }
}