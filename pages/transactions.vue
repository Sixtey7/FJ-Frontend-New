<template>
  <v-layout>
    <v-flex class="text-center">
      <TransactionList
        :transactionModel = "transactionModel"
        :txArray = "transactionModel.txArray" />
    </v-flex>
  </v-layout>
</template>
<script>
import TransactionModel from '../model/TransactionModel';
import TransactionList from '../components/transactions/TransactionList';
export default {
  name: 'Transactions',
  components: {
    TransactionList 
  },
  data() {
    return {
      transactionModel: new TransactionModel(this.backendHost)
    }
  },
  beforeCreate() {
    this.backendHost = "raspberrypi:8081"
  }
}
</script>
