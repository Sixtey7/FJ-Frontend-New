<template>
    <v-card
        class = "mx-auto"
        max-width="300px"
        title
    >
       <v-data-table
            :headers="headers"
            :items="accountsArray"
            :items-per-page="10"
            class="elevation-1"
        >
       </v-data-table>
    </v-card>
</template>
<script>
import AccountModel from '../../model/AccountModel';

export default {
    name: 'AccountList',
    data() {
        return {
            headers: [
                {
                    text: 'Name',
                    align: 'start',
                    sortable: true,
                    value: 'name'
                },
                {
                    text: 'Dynamic',
                    value: 'dynamic'
                },
                {
                    text: 'Notes',
                    value: 'notes'
                }

            ]
        }
    },
    props: {
        accountModel: AccountModel,
        accountsArray: Array
    }
}
</script>