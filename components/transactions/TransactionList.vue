<template>
    <v-card
        class = "mx-auto"
        max-width="1500px"
        title
    >
        <v-data-table
            :headers="headers"
            :items="txArray"
            :items-per-page="50"
            class="elevation-1"
        >
        </v-data-table>
    </v-card>
</template>
<script>
import TransactionModel from '../../model/TransactionModel';
export default {
    name: 'TransactionList',
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
                    text: 'Date',
                    value: 'date',
                    sortable: true
                },
                {
                    text: 'Amount',
                    value: 'amount'
                },
                {
                    text: 'Balance',
                    value: 'balance'
                },
                {
                    text: 'Type',
                    value: 'type'
                },
                {
                    text: 'Notes',
                    value: 'notes'
                }
            ]
        }
    },
    props: {
        transactionModel: TransactionModel,
        txArray: Array
    }
}
</script>