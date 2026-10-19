import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { VictoryPie } from 'victory-native';
import { getRequest } from '../components/mainURL.js';
import { GET_PORTFOLIO_STATS } from '../components/EndPoints.js';

const App = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartError, setChartError] = useState(null);
  
  const [isDataVisible, setIsDataVisible] = useState(true);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await getRequest(GET_PORTFOLIO_STATS);
        
        const formattedData = response.map(item => ({
          x: item.label, 
          y: parseFloat(item.value) 
        }));
        
        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch pie chart data:", error);
        setChartError(error instanceof Error ? error.message : String(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1A1B41' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 1, height: 30, backgroundColor: '#4A4A6A', marginRight: 10 }} />

            <Ionicons name="menu" size={24} color="white" />
          
          </View>
          <Text style={{ color: 'white', fontSize: 17, fontWeight: '600' }}>Portfolio</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="search" size={24} color="white" style={{ marginRight: 14 }} />
            <Ionicons name="notifications-outline" size={24} color="white" />
          </View>
        </View>

        {/* Total Balance Card */}
        <View style={{ backgroundColor: '#8A2BE2', marginHorizontal: 16, borderRadius: 20, padding: 20, marginTop: 10 }}>
          <Text style={{ color: 'white', fontSize: 36, fontWeight: 'bold' }}>
            {isBalanceVisible ? '֏2,340.00' : '••••••••'}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Ionicons name="information-circle-outline" size={14} color="#E0E0E0" />
            <Text style={{ color: '#E0E0E0', fontSize: 14, marginLeft: 5 }}>Total Balance</Text>
            <TouchableOpacity
              onPress={() => setIsBalanceVisible(visible => !visible)}
              
              
            >
              <Ionicons
                name={isBalanceVisible ? "eye-outline" : "eye-off-outline"}
                size={16}
                color="#E0E0E0"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          </View>
          

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }}>
            <TouchableOpacity style={{ backgroundColor: '#00A82D', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, flex: 1, marginRight: 10, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>DEPOSIT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: '#c82333', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, flex: 1, marginLeft: 10, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>WITHDRAW</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chart Section */}
        <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Cash | Holding</Text>
            
            <TouchableOpacity onPress={() => setIsDataVisible(!isDataVisible)}>
              <Ionicons 
                name={isDataVisible ? "eye-outline" : "eye-off-outline"} 
                size={18} 
                color="white" 
                style={{ marginLeft: 10 }} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={{ alignItems: 'center', marginVertical: 20, minHeight: 220, justifyContent: 'center' }}>
             {isLoading ? (
               <ActivityIndicator size="large" color="#8A2BE2" />
             ) : chartError ? (
               <Text style={{ color: '#FF5252', textAlign: 'center' }}>
                 {chartError}
               </Text>
             ) : isDataVisible ? (
               <VictoryPie
                 data={chartData}
                 animate={{ duration: 500 }}
                 colorScale={["#D8B4FF", "#8A2BE2"]}
                 labels={({ datum }) => `${datum.y}%`}
                 labelRadius={({ innerRadius }) => innerRadius + 60 }
                 style={{
                   labels: { 
                     fill : ({ datum }) => datum.x === 'Cash' ? 'black' : 'white', 
                     fontSize: 16, 
                     fontWeight: "bold" 
                   }
                 }}
                 width={350}
                 height={300}
                 padding={30}
               />
             ) : (
              //hidden chart
               <View style={{ width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }} />
             )}
          </View>
        </View>

        {/* Stats Cards */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
            {/* Cash Card */}
            <View style={{ backgroundColor: '#0F2027', borderRadius: 12, padding: 15, flex: 1, marginRight: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ color: '#8892B0', fontSize: 14 }}>Cash</Text>
                <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#D8B4FF' }} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isDataVisible ? (
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>₼ 2,000,000</Text>
                ) : (
                  <View style={{ height: 22, width: '70%', backgroundColor: '#1A2530', borderRadius: 4 }} />
                )}
                <Ionicons name="chevron-forward" size={16} color="white" />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, height: 18 }}>
                {isDataVisible ? (
                  <>
                    <Text style={{ color: '#00E676', fontSize: 12 }}>+12.23% </Text>
                    <Ionicons name="arrow-up" size={12} color="#00E676" />
                  </>
                ) : (
                  <View style={{ height: 14, width: '40%', backgroundColor: '#1A2530', borderRadius: 4 }} />
                )}
              </View>
            </View>

            {/* Holding Card */}
            <View style={{ backgroundColor: '#0F2027', borderRadius: 12, padding: 15, flex: 1, marginLeft: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ color: '#8892B0', fontSize: 14 }}>Holding</Text>
                <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#8A2BE2' }} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isDataVisible ? (
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>₼ 2,000,000</Text>
                ) : (
                  <View style={{ height: 22, width: '70%', backgroundColor: '#1A2530', borderRadius: 4 }} />
                )}
                <Ionicons name="chevron-forward" size={16} color="white" />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, height: 18 }}>
                {isDataVisible ? (
                  <>
                    <Text style={{ color: '#00E676', fontSize: 12 }}>+12.23% </Text>
                    <Ionicons name="arrow-up" size={12} color="#00E676" />
                  </>
                ) : (
                  <View style={{ height: 14, width: '40%', backgroundColor: '#1A2530', borderRadius: 4 }} />
                )}
              </View>
            </View>
          </View>

          {/* Unrealized Gain/Loss Card */}
          <View style={{ backgroundColor: '#0F2027', borderRadius: 12, padding: 15 }}>
            <Text style={{ color: '#8892B0', fontSize: 14, marginBottom: 5 }}>Unrealized Gain/Loss</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              {isDataVisible ? (
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>₼ 2,000,000</Text>
              ) : (
                <View style={{ height: 22, width: '40%', backgroundColor: '#1A2530', borderRadius: 4 }} />
              )}
              <Ionicons name="chevron-forward" size={16} color="white" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, height: 18 }}>
              {isDataVisible ? (
                <>
                  <Text style={{ color: '#FF5252', fontSize: 12 }}>-20.23% </Text>
                  <Ionicons name="arrow-down" size={12} color="#FF5252" />
                </>
              ) : (
                <View style={{ height: 14, width: '20%', backgroundColor: '#1A2530', borderRadius: 4 }} />
              )}
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#0A1128', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, paddingBottom: 25, borderTopWidth: 1, borderTopColor: '#1A1B41' }}>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Ionicons name="folder-outline" size={20} color="#8892B0" />
          <Text style={{ color: '#8892B0', fontSize: 10, marginTop: 4 }}>Portfolio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Ionicons name="document-text-outline" size={20} color="#8892B0" />
          <Text style={{ color: '#8892B0', fontSize: 10, marginTop: 4 }}>A/c Stmt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Ionicons name="stats-chart-outline" size={20} color="#8892B0" />
          <Text style={{ color: '#8892B0', fontSize: 10, marginTop: 4 }}>Market</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Ionicons name="receipt-outline" size={20} color="#8892B0" />
          <Text style={{ color: '#8892B0', fontSize: 10, marginTop: 4 }}>Order List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Ionicons name="wallet-outline" size={20} color="#8892B0" />
          <Text style={{ color: '#8892B0', fontSize: 10, marginTop: 4 }}>Wallet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;