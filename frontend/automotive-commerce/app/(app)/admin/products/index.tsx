// app/(app)/admin/products.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../../context/AuthContext';
import { MaterialIcons, FontAwesome, Feather, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  averageRating: number;
  description?: string;
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    images: [] as string[],
  });
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const authToken = await AsyncStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:5000/api/products/get-all-products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchQuery) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))
    );
    setFilteredProducts(filtered);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/products/search?query=${searchQuery}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setFilteredProducts(data.products);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        setUploading(true);
        interface Asset {
            uri: string;
        }

        interface UploadResult {
            url: string;
        }

        const uploadedImages: string[] = await Promise.all(
            result.assets.map(async (asset: Asset): Promise<string> => {
                const formData = new FormData();
                formData.append('file', {
                    uri: asset.uri,
                    type: 'image/jpeg',
                    name: 'image.jpg',
                } as any);

                const uploadResponse = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                });

                const data: UploadResult = await uploadResponse.json();
                return data.url;
            })
        );

        setFormData({
          ...formData,
          images: [...formData.images, ...uploadedImages],
        });
      }
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert('Error', 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const openEditModal = (product: Product) => {
    setEditMode(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      images: product.images,
    });
    setModalVisible(true);
  };

  const openCreateModal = () => {
    setEditMode(false);
    setCurrentProduct(null);
    setFormData({
      name: '',
      price: '',
      stock: '',
      description: '',
      images: [],
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.stock || formData.images.length === 0) {
      Alert.alert('Error', 'Please fill all required fields and upload at least one image');
      return;
    }

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        images: formData.images,
      };

      let response;
      if (editMode && currentProduct) {
        response = await fetch(`http://localhost:5000/api/products/update-product/${currentProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(productData)
        });
      } else {
        response = await fetch('http://localhost:5000/api/products/add-product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(productData)
        });
      }

      if (!response.ok) throw new Error(editMode ? 'Failed to update product' : 'Failed to create product');

      fetchProducts();
      setModalVisible(false);
      Alert.alert('Success', editMode ? 'Product updated successfully' : 'Product created successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/products/delete-product/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete product');
      
      fetchProducts();
      Alert.alert('Success', 'Product deleted successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteProduct(id), style: 'destructive' }
      ]
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      {item.images.length > 0 && (
        <Image 
          source={{ uri: item.images[0] }} 
          style={styles.productImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.productStock}>Stock: {item.stock}</Text>
        {item.averageRating > 0 && (
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.averageRating.toFixed(1)}</Text>
          </View>
        )}
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => openEditModal(item)}
        >
          <Feather name="edit" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => confirmDelete(item._id)}
        >
          <Feather name="trash-2" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <ActivityIndicator size="large" color={colors.primary} />
        <Footer />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchProducts}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
        <Footer />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Product Management</Text>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={openCreateModal}
            >
              <Text style={styles.buttonText}>Add Product</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor={colors.text}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <MaterialIcons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.productList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name="package" size={50} color={colors.accent} />
                <Text style={styles.emptyText}>No products found</Text>
              </View>
            }
          />
        </View>
      </ScrollView>

      {/* Product Form Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editMode ? 'Edit Product' : 'Create New Product'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              placeholderTextColor={colors.text}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              placeholderTextColor={colors.text}
              value={formData.price}
              onChangeText={(text) => setFormData({...formData, price: text})}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Stock Quantity"
              placeholderTextColor={colors.text}
              value={formData.stock}
              onChangeText={(text) => setFormData({...formData, stock: text})}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description (Optional)"
              placeholderTextColor={colors.text}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              multiline
            />

            <Text style={styles.sectionTitle}>Product Images</Text>
            <View style={styles.imagesContainer}>
              {formData.images.map((uri, index) => (
                <View key={index} style={styles.imagePreviewContainer}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <MaterialIcons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity 
                style={styles.addImageButton}
                onPress={pickImage}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Feather name="plus" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={uploading}
            >
              <Text style={styles.buttonText}>
                {editMode ? 'Update Product' : 'Create Product'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    paddingBottom: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productStock: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 4,
  },
  productActions: {
    flexDirection: 'column',
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
    padding: 20,
  },
  retryText: {
    color: colors.primary,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  modalContent: {
    paddingBottom: 40,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: colors.text,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  imagePreviewContainer: {
    width: 80,
    height: 80,
    marginRight: 10,
    marginBottom: 10,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  submitButton: {
    backgroundColor: colors.primary,
    marginTop: 20,
  },
});

export default AdminProductsPage;