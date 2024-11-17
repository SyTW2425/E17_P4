import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model'; // Asegúrate de importar la interfaz Product
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-manager',
  standalone: true,
  templateUrl: './product-manager.component.html',
  imports: [CommonModule, FormsModule], // Asegúrate de importar FormsModule
  styleUrls: ['./product-manager.component.css'],
})
export class ProductManagerComponent implements OnInit {
  products: Product[] = [
    {
      id: 1,
      name: 'Producto 1',
      description: 'Descripción del producto 1',
      quantity: 50,
      price: 100,
      supplier: 'Proveedor A',
    },
    {
      id: 2,
      name: 'Producto 2',
      description: 'Descripción del producto 2',
      quantity: 30,
      price: 200,
      supplier: 'Proveedor B',
    },
    {
      id: 3,
      name: 'Producto 3',
      description: 'Descripción del producto 3',
      quantity: 100,
      price: 150,
      supplier: 'Proveedor C',
    },
  ];

  searchCriteria: string = 'name'; // El valor predeterminado es buscar por nombre
  searchTerm: string = '';
  filteredProducts: Product[] = [];

  editingProduct: Product = {
    id: 0,
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    supplier: '',
  };

  newProduct: Product = {
    id: 0,
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    supplier: '',
  };

  isAdding: boolean = false;
  isEditing: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.filteredProducts = [...this.products];
  }

  // Función para iniciar la adición de un nuevo producto
  startAddProduct(): void {
    this.isAdding = true;
  }

  // Función para añadir un nuevo producto
  addProduct(): void {
    if (
      this.newProduct.name &&
      this.newProduct.supplier &&
      this.newProduct.quantity >= 0 &&
      this.newProduct.price >= 0
    ) {
      // Generamos un nuevo ID para el producto
      this.newProduct.id = this.products.length
        ? Math.max(...this.products.map((p) => p.id)) + 1
        : 1;

      // Añadimos el producto al arreglo
      this.products.push({ ...this.newProduct });

      // Limpiamos el formulario
      this.newProduct = {
        id: 0,
        name: '',
        description: '',
        quantity: 0,
        price: 0,
        supplier: '',
      };

      this.isAdding = false; // Ocultamos el formulario de adición
      this.filterProducts();
    } else {
      alert('Por favor, completa todos los campos obligatorios');
    }
  }

  // Función para cancelar la adición de un producto
  cancelAdd(): void {
    this.isAdding = false;
    this.newProduct = {
      id: 0,
      name: '',
      description: '',
      quantity: 0,
      price: 0,
      supplier: '',
    };
  }

  // Función para iniciar la edición de un producto
  editProduct(product: Product): void {
    this.editingProduct = { ...product }; // Copia el producto a editar
    this.isEditing = true; // Muestra el formulario de edición
  }

  // Función para guardar los cambios después de editar
  saveEditedProduct(): void {
    if (this.editingProduct.id !== 0) {
      const index = this.products.findIndex(
        (product) => product.id === this.editingProduct.id
      );
      if (index !== -1) {
        this.products[index] = { ...this.editingProduct }; // Reemplazamos el producto editado con los nuevos valores
      }
      this.isEditing = false; // Ocultamos el formulario de edición
      this.editingProduct = {
        id: 0,
        name: '',
        description: '',
        quantity: 0,
        price: 0,
        supplier: '',
      }; // Restablecemos el producto a editar
      this.filterProducts(); // Filtramos los productos después de editar
    }
  }

  // Función para cancelar la edición
  cancelEdit(): void {
    this.isEditing = false;
    this.editingProduct = {
      id: 0,
      name: '',
      description: '',
      quantity: 0,
      price: 0,
      supplier: '',
    };
  }

  // Función para eliminar un producto
  deleteProduct(productId: number): void {
    this.products = this.products.filter((product) => product.id !== productId); // Eliminamos el producto
    this.filterProducts();
  }

  // Filtrar los productos según el campo seleccionado
  filterProducts(): void {
    this.filteredProducts = this.products.filter((product) => {
      if (this.searchCriteria === 'name') {
        return product.name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      } else if (this.searchCriteria === 'description') {
        return product.description
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      } else if (this.searchCriteria === 'quantity') {
        return product.quantity.toString().includes(this.searchTerm);
      } else if (this.searchCriteria === 'price') {
        return product.price.toString().includes(this.searchTerm);
      } else if (this.searchCriteria === 'supplier') {
        return product.supplier
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      } else if (this.searchCriteria === 'id') {
        return product.id.toString().includes(this.searchTerm);
      }
      return false; // Si no coincide con ningún campo
    });
  }
}
