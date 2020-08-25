<template>
    <v-card
        class = "mx-auto"
        max-width="300px"
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
                },
                {
                    text: 'Amount',
                    value: 'amount'
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