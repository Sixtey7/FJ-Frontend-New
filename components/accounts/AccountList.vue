<template>
    <v-card
        class = "mx-auto"
        max-width="300px"
        title
    >
        <v-list dense>
            <v-subheader>Accounts</v-subheader>
            <v-list-item-group
                v-model="account"
                color="primary"
            >
                <v-list-item
                    v-for = "(account, i) in accountsArray"
                    :key=i
                >
                    <v-list-item-content>
                        <v-list-item-title v-text="account.name"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-card>
</template>
<script>
import AccountModel from '../../model/AccountModel';

export default {
    name: 'AccountList',
    data() {
        return {
            
        }
    },
    props: {
        accountModel: AccountModel,
        accountsArray: Array
    }
}
</script>