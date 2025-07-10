import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { testBackendConnection } from '../utils/testConnection';
import { CONFIG } from '../constants/config';

export default function TestConnectionScreen() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      console.log('🔧 Iniciando diagnóstico completo...');
      const result = await testBackendConnection();
      setTestResult(result);
      
      if (result.success) {
        Alert.alert('✅ Conexión exitosa', 'El backend está funcionando correctamente');
      } else {
        Alert.alert('❌ Error de conexión', `Error: ${result.error || 'Backend no disponible'}`);
      }
    } catch (error) {
      const err = error as Error;
      Alert.alert('❌ Error', `Error al probar la conexión: ${err.message}`);
      console.error('Error en prueba:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 Diagnóstico de Conexión</Text>
        <Text style={styles.subtitle}>Verifica la comunicación con el backend</Text>
        
        <View style={styles.configInfo}>
          <Text style={styles.configTitle}>📋 Configuración Actual:</Text>
          <Text style={styles.configText}>🌐 Host: {CONFIG.API.HOST}</Text>
          <Text style={styles.configText}>🔌 Puerto: {CONFIG.API.PORT}</Text>
          <Text style={styles.configText}>🔗 URL completa: {CONFIG.API.BASE_URL}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={runTest}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? '⏳ Diagnosticando...' : '🚀 Ejecutar Diagnóstico'}
        </Text>
      </TouchableOpacity>

      {testResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>📊 Resultado del Diagnóstico</Text>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Estado del Backend:</Text>
            <Text style={[styles.resultValue, testResult.isHealthy ? styles.success : styles.error]}>
              {testResult.isHealthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}
            </Text>
          </View>

          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Status del Endpoint:</Text>
            <Text style={[styles.resultValue, testResult.endpointStatus === 200 ? styles.success : styles.error]}>
              {testResult.endpointStatus}
            </Text>
          </View>

          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Conexión Exitosa:</Text>
            <Text style={[styles.resultValue, testResult.success ? styles.success : styles.error]}>
              {testResult.success ? '✅ SÍ' : '❌ NO'}
            </Text>
          </View>

          {testResult.error && (
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Error:</Text>
              <Text style={[styles.resultValue, styles.error]}>
                {testResult.error}
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  configInfo: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  configTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  configText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  success: {
    color: '#4CAF50',
  },
  error: {
    color: '#F44336',
  },
});
