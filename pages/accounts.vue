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

export default {
    name: 'Accounts',
    components: {
      AccountList
    },
    data() {
        return {
            accountModel:  new AccountModel(this.backendHost)
        }
    },
    beforeCreate() {
        this.backendHost = "http://raspberrypi:8081ß/accounts";
    }
}
</script>