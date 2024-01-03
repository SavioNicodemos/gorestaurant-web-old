/* eslint-disable no-console */
import { useEffect, useState } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

type IFoodPlate = {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
};

const Dashboard = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      await api.get('/foods').then(response => setFoods(response.data));
    }

    loadFoods();
  }, []);

  async function handleAddFood(food: Omit<IFoodPlate, 'id' | 'available'>): Promise<void> {
    try {
      const response = await api.post('/foods', food);

      setFoods([...foods, response.data]);
    } catch (err) {
      console.warn(err);
    }
  }

  async function handleUpdateFood(food: Omit<IFoodPlate, 'id' | 'available'>): Promise<void> {
    try {
      Object.assign(editingFood, food);

      await api.put(`/foods/${editingFood.id}`, food);

      const index = foods.findIndex(item => item.id === editingFood.id);

      if (index !== -1) {
        const newFoods = foods;
        newFoods[index] = editingFood;

        setFoods(newFoods);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async function handleDeleteFood(id: number): Promise<void> {
    await api.delete(`/foods/${id}`);

    const index = foods.findIndex(item => item.id === id);

    if (index === -1) {
      console.error('Prato não encontrado!');
      return;
    }

    const newFoods = foods.filter(foodPlate => foodPlate.id !== id);

    setFoods(newFoods);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood isOpen={modalOpen} setIsOpen={toggleModal} handleAddFood={handleAddFood} />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid='foods-list'>
        {foods?.map(food => (
          <Food
            key={food.id}
            food={food}
            handleDelete={handleDeleteFood}
            handleEditFood={handleEditFood}
          />
        ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
