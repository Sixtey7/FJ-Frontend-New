<template>
  <v-layout>
    <v-flex class="text-center">
      <img
        src="/v.png"
        alt="Vuetify.js"
        class="mb-5"
      >
      <blockquote class="blockquote">
        Accounts will go here!
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
    </v-flex>
  </v-layout>
</template>
<script>
import AccountModel from '../../model/AccountModel';
import Vue from 'vue';
export default {
    name: 'Accounts',
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