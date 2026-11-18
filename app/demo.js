import { useAppTheme } from '../components/theme/ThemeManager';
//import ThemeToggle from '../components/theme/ThemeToggle';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { VictoryChart, VictoryArea, VictoryAxis, VictoryScatter } from 'victory-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { getRequest } from '../components/mainURL.js'; 
import { GET_DEMO } from '../components/EndPoints.js'; 

const Demo = () => {
  const { theme } = useAppTheme();
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
         const response = await getRequest(GET_DEMO);
         console.log("---> "+JSON.stringify(response))
         setChartData(response);
         setIsLoading(false);

      } catch (error) {
        console.error("Failed to fetch performance data:", error);
        setIsLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 1, height: 30, backgroundColor: theme.surfaceAlt, marginRight: 10 }} />
            <Ionicons name="menu" size={24} color={theme.text} />
          </View>
          <Text style={{ color: theme.text, fontSize: 17, fontWeight: '600' }}>Portfolio Performance</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="search" size={24} color={theme.text} style={{ marginRight: 14 }} />
            <Ionicons name="notifications-outline" size={24} color={theme.text} />
          </View>
        </View>

        {/* Line Chart */}
        <View style={{ paddingHorizontal: 20, marginTop: 30, alignItems: 'center' }}>
          {isLoading ? (
            <View style={{ height: 250, justifyContent: 'center' }}>
              <ActivityIndicator size="large" color={theme.accent} />
            </View>
          ) : (
            <VictoryChart width={380} height={300}>
              
              {/* Gradient */}
              <Defs>
                <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    {/*begining of gradient*/}
                  <Stop offset="30%" stopColor="#1f43c7" stopOpacity={0.6} /> 
                   {/*end of gradient*/}
                  <Stop offset="100%" stopColor="#1A1B41" stopOpacity={0.0} />
                </LinearGradient>
              </Defs>

              {/* X Axis */}
              <VictoryAxis 
                style={{ 
                  axis: { stroke: theme.border }, 
                  tickLabels: { fill: theme.muted, fontSize: 12, padding: 10 } 
                }} 
              />
              
              {/* Y Axis */}
              <VictoryAxis 
                dependentAxis 
                tickFormat={(t) => `$${t / 1000}k`}
                style={{ 
                  axis: { stroke: theme.border }, 
                  tickLabels: { fill: theme.muted, fontSize: 12, padding: 10 },
                  grid: { stroke: "rgba(255, 255, 255, 0.07)" }
                }} 
              />

              <VictoryArea
                data={chartData}
                animate={{ duration: 1000, easing: "exp" }}
                style={{
                  data: { 
                    fill: "url(#areaGradient)",
                    stroke: theme.accent,         
                    strokeWidth: 3 
                  }
                }}
              />
              <VictoryScatter
                data={chartData}
                size={4}
                style={{
                  data: { 
                    fill: theme.accent,      
                    stroke: theme.accent,    
                    strokeWidth: 1 
                  }
                }}
              />

            </VictoryChart>
          )}
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: theme.navBackground, flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, paddingBottom: 25, borderTopWidth: 1, borderTopColor: theme.border }}>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Ionicons name="folder-outline" size={20} color={theme.muted} />
          <Text style={{ color: theme.muted, fontSize: 10, marginTop: 4 }}>Portfolio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Ionicons name="document-text-outline" size={20} color={theme.muted} />
          <Text style={{ color: theme.muted, fontSize: 10, marginTop: 4 }}>A/c Stmt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Ionicons name="stats-chart-outline" size={20} color={theme.muted} />
          <Text style={{ color: theme.muted, fontSize: 10, marginTop: 4 }}>Market</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Ionicons name="receipt-outline" size={20} color={theme.muted} />
          <Text style={{ color: theme.muted, fontSize: 10, marginTop: 4 }}>Order List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Ionicons name="wallet-outline" size={20} color={theme.muted} />
          <Text style={{ color: theme.muted, fontSize: 10, marginTop: 4 }}>Wallet</Text>
        </TouchableOpacity>
      </View>
    {/*<ThemeToggle />*/}
    </SafeAreaView>
  );
};

export default Demo;