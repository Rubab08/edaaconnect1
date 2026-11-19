import { useAppTheme } from '../components/theme/ThemeManager';
//import ThemeToggle from '../components/theme/ThemeToggle';
import React, { useState, useEffect } from 'react';
import { Alert, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { VictoryPie, LineSegment} from 'victory-native';
import { getRequest } from '../components/mainURL.js';
import { Formik } from 'formik';
import { GET_PORTFOLIO_STATS } from '../components/EndPoints.js';
   import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Heading,
  Input,
  InputField,
  Button,
  ButtonText,
  HStack,
  VStack,
  Box,
   Icon,
   CloseIcon,
  Text as GluestackText
} from '@gluestack-ui/themed';

const App = ({ navigation }) => {
  const { theme } = useAppTheme();
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartError, setChartError] = useState(null);
  
  const [isDataVisible, setIsDataVisible] = useState(true);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}
    edges={['right', 'left','bottom']}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        
        {/* Total Balance Card */}
        <View style={{ backgroundColor: theme.accent, marginHorizontal: 16, borderRadius: 20, padding: 20, marginTop: 10 }}>
          <Text style={{ color: theme.text, fontSize: 36, fontWeight: 'bold' }}>
            {isBalanceVisible ? '֏2,340.00' : '••••••••'}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Ionicons name="information-circle-outline" size={14} color={theme.muted} />
            <Text style={{ color: theme.muted, fontSize: 14, marginLeft: 5 }}>Total Balance</Text>
            <TouchableOpacity
              onPress={() => setIsBalanceVisible(visible => !visible)}
              
              
            >
              <Ionicons
                name={isBalanceVisible ? "eye-outline" : "eye-off-outline"}
                size={16}
                color={theme.muted}
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          </View>
          

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }}>
            <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{ 
             backgroundColor: theme.danger,
             paddingVertical: 12,
             paddingHorizontal: 30,
             borderRadius: 8,
             flex: 1,
             marginRight: 10,
             alignItems: 'center' 


            }}
          > 
            <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 14 }}>DEPOSIT</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ backgroundColor: theme.danger, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, flex: 1, marginLeft: 10, alignItems: 'center' }}>
            <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 14 }}>WITHDRAW</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chart Section */}
        <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600' }}>Cash | Holding</Text>
            
            <TouchableOpacity onPress={() => setIsDataVisible(!isDataVisible)}>
              <Ionicons 
                name={isDataVisible ? "eye-outline" : "eye-off-outline"} 
                size={18} 
                color={theme.text}
                style={{ marginLeft: 10 }} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={{ alignItems: 'center', marginVertical: 20, minHeight: 220, justifyContent: 'center' }}>
             {isLoading ? (
               <ActivityIndicator size="large" color={theme.accent} />
             ) : chartError ? (
               <Text style={{ color: theme.danger, textAlign: 'center' }}>
                 {chartError}
               </Text>
             ) : isDataVisible ? (
               <VictoryPie
                 data={chartData}
                 animate={{ duration: 500 }}
                 colorScale={["#D8B4FF", "#8A2BE2"]}
                 labels={({ datum }) => `${datum.x}, ${datum.y}%`}
                 
                 
                 labelIndicator={
                   <LineSegment style={{ stroke: theme.text, strokeWidth: 1, opacity: 0.5 }} />
                 }
                 labelIndicatorInnerOffset={10}
                 labelIndicatorOuterOffset={10}
                 
                 labelPosition="centroid"
                 labelPlacement="vertical"
                 
                 
                 labelRadius={({ innerRadius }) => innerRadius + 120 }
                 
                
                 padding={{ top: 70, bottom: 70, left: 100, right: 100 }}
                 
                 style={{
                   labels: { 
                     fill: theme.text, 
                     fontSize: 13, 
                     fontWeight: "bold" 
                   }
                 }}
                 width={400}
                 height={400}
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
            <View style={{ backgroundColor: theme.surface, borderRadius: 12, padding: 15, flex: 1, marginRight: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ color: theme.muted, fontSize: 14 }}>Cash</Text>
                <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: theme.surfaceAlt }} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isDataVisible ? (
                  <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>₼ 2,000,000</Text>
                ) : (
                  <View style={{ height: 22, width: '70%', backgroundColor: theme.surface, borderRadius: 4 }} />
                )}
                <Ionicons name="chevron-forward" size={16} color={theme.text} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, height: 18 }}>
                {isDataVisible ? (
                  <>
                    <Text style={{ color: theme.text, fontSize: 12 }}>+12.23% </Text>
                    <Ionicons name="arrow-up" size={12} color={theme.text} />
                  </>
                ) : (
                  <View style={{ height: 14, width: '40%', backgroundColor: theme.surface, borderRadius: 4 }} />
                )}
              </View>
            </View>

            {/* Holding Card */}
            <View style={{ backgroundColor: theme.surface, borderRadius: 12, padding: 15, flex: 1, marginLeft: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ color: theme.muted, fontSize: 14 }}>Holding</Text>
                <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: theme.accent }} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isDataVisible ? (
                  <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>₼ 2,000,000</Text>
                ) : (
                  <View style={{ height: 22, width: '70%', backgroundColor: theme.surface, borderRadius: 4 }} />
                )}
                <Ionicons name="chevron-forward" size={16} color={theme.text} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, height: 18 }}>
                {isDataVisible ? (
                  <>
                    <Text style={{ color: theme.text, fontSize: 12 }}>+12.23% </Text>
                    <Ionicons name="arrow-up" size={12} color={theme.text} />
                  </>
                ) : (
                  <View style={{ height: 14, width: '40%', backgroundColor: theme.surface, borderRadius: 4 }} />
                )}
              </View>
            </View>
          </View>

          {/* Unrealized Gain/Loss Card */}
          <View style={{ backgroundColor: theme.surface, borderRadius: 12, padding: 15 }}>
            <Text style={{ color: theme.muted, fontSize: 14, marginBottom: 5 }}>Unrealized Gain/Loss</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              {isDataVisible ? (
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>₼ 2,000,000</Text>
              ) : (
                <View style={{ height: 22, width: '40%', backgroundColor: theme.surface, borderRadius: 4 }} />
              )}
              <Ionicons name="chevron-forward" size={16} color={theme.text} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, height: 18 }}>
              {isDataVisible ? (
                <>
                  <Text style={{ color: theme.danger, fontSize: 12 }}>-20.23% </Text>
                  <Ionicons name="arrow-down" size={12} color={theme.danger} />
                </>
              ) : (
                <View style={{ height: 14, width: '20%', backgroundColor: theme.surface, borderRadius: 4 }} />
              )}
            </View>
          </View>
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
    

  
{/* MODAL FOR DEPOSIT WITH FORMIK FORM */}

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
>
  <ModalBackdrop />

  <ModalContent
    bg={theme.surface}
    borderColor={theme.border}
    borderWidth={1}
    borderRadius={15}
    p="$5"       
    maxW="700%"     
    h="80%"   
  >
    <ModalHeader
  justifyContent="space-between"
  alignItems="center"
  position="relative"
  mb="$5"
>
  <VStack
        w="100%"
        alignItems="center"
        space="xs"
        mt="$5"
      >

  <Ionicons
    name="wallet-outline"
    size={64}
    color={theme.accent}
  />

  <Heading size="2xl" fontWeight="$bold" color={theme.text}
  textAlign="center"
  >
    Deposit Amount
  
  </Heading>
   <GluestackText
          color={theme.muted}
          fontSize={18}
          textAlign="center"
        >
          Add amount to your account
        </GluestackText>
      </VStack>

  <ModalCloseButton
        position="absolute"
        top={0}
        right={0}
        onPress={() => setShowModal(false)}
      >
        <Icon
          as={CloseIcon}
          color={theme.text}
          size="md"
        />
      </ModalCloseButton>
</ModalHeader>

  <Box flex={1} justifyContent="center"></Box>
    <Formik
      initialValues={{
        name: '',
        amount: ''
      }}

      validate={(values) => {
        const errors = {};

        if (!values.name) {
          errors.name = 'Name is required';
        }

        if (!values.amount) {
          errors.amount = 'Amount is required';
        }

        return errors;
      }}

      onSubmit={(values) => {
        console.log(values);
        setShowModal(false);
      }}
    >
      {({
        handleChange,
        handleSubmit,
        handleBlur,
        values,
        errors,
        touched
      }) => (
        <>
          <ModalBody
          >
            <VStack space="md" mt="$4">

              {/* Name Input */}

              
              <Input
              bg={theme.background}
                  borderColor={theme.border}
                  borderWidth={1}
                  borderRadius={12}
                  h={50}
                  alignItems="center"
              
>

                   {/* person icon */}
                  <Box ml="$3" mr="$2">
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={theme.muted}
                    />
                  </Box>

                <InputField
                  placeholder="Enter Name"
                  placeholderTextColor={theme.muted}
                  color={theme.text}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  
                />
              </Input>

              {touched.name && errors.name && (
                <GluestackText color="#FF0000">
                  {errors.name}
                </GluestackText>
              )}

              {/* Amount Input */}
               
                   <Input
                  bg={theme.background}
                  borderColor={theme.border}
                  borderWidth={1}
                  borderRadius={12}
                  h={50}
                  alignItems="center"
                >

                  {/* NEW: Coins icon */}
                  <Box ml="$3" mr="$2">
                    <Ionicons
                      name="cash-outline"
                      size={20}
                      color={theme.muted}
                    />
                  </Box>



                  <InputField
                    flex={1}
                    placeholder="Enter Amount"
                    placeholderTextColor={theme.muted}
                    color={theme.text}
                    value={values.amount}
                    onChangeText={handleChange('amount')}
                    onBlur={handleBlur('amount')}
                  />

                </Input>

              {touched.amount && errors.amount && (
                <GluestackText color="#FF0000">
                  {errors.amount}
                </GluestackText>
              )}

            </VStack>
          </ModalBody>

          <ModalFooter mt="$4">

         {/* Purple button */}
              <Button
                w="100%"
                h={50}
                borderRadius={12}
                bg="#713DF0"
                mt="$2"
                onPress={handleSubmit}
              >

                <HStack
                  alignItems="center"
                  space="sm"
                >

                  {/* NEW: Deposit icon */}
                  <Ionicons
                    name="download-outline"
                    size={20}
                    color="#FFFFFF"
                  />

                  <ButtonText
                    color="#FFFFFF"
                    fontWeight="bold"
                    fontSize={16}
                  >
                    Deposit
                  </ButtonText>

                </HStack>
              </Button>


              {/* CANCEL BUTTON */}

              <Button
                variant="outline"
                w="100%"
                h={48}
                borderRadius={12}
                borderColor={theme.border}
                borderWidth={1}
                bg="transparent"
                onPress={() => setShowModal(false)}
                mt="$2"
              >

                <ButtonText
                  color={theme.muted}
                  fontWeight="600"
                  fontSize={15}
                >
                  Cancel
                </ButtonText>

              </Button>

          </ModalFooter>
        </>
      )}
    </Formik>
  </ModalContent>
</Modal>




    </SafeAreaView>
  );
};

export default App;