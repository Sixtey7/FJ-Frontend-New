<template>
  <v-layout>
    <v-flex class="text-center">
      <AccountList 
        :accountModel = "accountModel"
        :accountsArray = "accountModel.accountsArray"/>
    </v-flex>
  </v-layout>
</template>
<script>
import AccountModel from '../model/AccountModel';
import AccountList from '../components/accounts/AccountList';
import Vue from 'vue';
export default {
    name: 'Accounts',
    components: {
      AccountList
    },
    data() {
        return {
            accountModel:  new AccountModel(Vue.$log, this.backendHost)
        }
    },
    beforeCreate() {
        this.backendHost = "http://localhost:8080/accounts";
    }
}
</script>