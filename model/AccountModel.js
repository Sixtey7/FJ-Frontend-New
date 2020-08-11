import axios from 'axios';
import AccountHelper from '../utils/AccountHelper';
const consola = require('consola');

const URL_SUFFIX = '/accounts/';
/**
 * Model class used to manage and interact with Account objects
 * 
 * Serves as the priamry interaction point with the backend
 */
class AccountModel {
    accountsArray;
    accountsTotal;
    _accountHelper;
    _logger;

    /**
     * Builds the Account Model.  Queries the backend for the initial account list
     * @param {Object} logger Logger object to be used for the class
     * @param {String} backendHost Hostname to find the bakcend at
     */
    constructor(backendHost) {
        this._logger = consola;
        this._logger.debug('running account model constructor!');
        this.backendURL = 'http://' + backendHost + URL_SUFFIX;
        this._accountHelper = new AccountHelper(consola);
        this.accountsArray = new Array();

        // Query the backend to get the current account objects
        axios
            .get(this.backendURL)
            .then(response => {
                this.accountsArray = this._accountHelper.massageAccounts(response.data);
                this._logger.debug('got ' + this.accountsArray.length + ' accounts!');
                this.determineTotal();

                this._logger.debug('finished standing up the account model!');
            });
    }

    /**
     * Saves the provided account (update or add) to both the collection and the backend
     * @param {Account} accountToSave The account to be persisted
     */
    async saveAccount(accountToSave) {
        // detemrine if this is an existing account or a new one
        if (accountToSave.id) {
            this._logger.debug('saving an edited account: ' + JSON.stringify(accountToSave))

            let returnVal = await this._postAccount(accountToSave);

            if (returnVal) {
                this.accountsArray = await this._accountHelper.mergeAccountIntoArray(accountToSave, this.accountsArray);

                this.determineTotal();
            }
            else {
                this._logger.error('failed to post the account!');
            }
        }
        else {
            this._logger.debug('adding a new account: ' + JSON.stringify(accountToSave));

            let returnVal = await this._putAccount(accountToSave);

            if (returnVal) {
                accountToSave.id = returnVal;
                this.accountsArray.push(accountToSave);

                this.determineTotal();
            }        
            else {
                this._logger.error('failed to put the account for: ' + JSON.stringify(accountToSave));
            }
        }
    }

    /**
     * Deletes the account with the provided ID from both the cache and the backend
     * @param {String} idToDelete String containing the UUID to be deleted
     */
    async deleteAccount(idToDelete) {
        this._logger.debug('Deleting an account with id: ' + idToDelete);

        let returnVa = await this._deleteAccount(idToDelete);

        if (returnVal) {
            let index = this.accountsArray.findIndex(account => {
                return account.id === idToDelete;
            });

            if (index >= 0) {
                this._logger.debug('found the index: ' + index);
                this.accountsArray.splice(index, 1);

                this.determineTotal();
            }
            else {
                this._logger.warn('failed to find the index in the array for account: ' + idToDelete);
            }
        }
    }

    /**
     * Helper method used to call the backends "PUT" endpoint
     * @param {Account} accountToPut Account to be put to the backend
     */
    async _putAccount(accountToPut) {
        // need to delete the epty id to prevent the backend from trying to handle it
        delete accountToPut.id;
        let accountJSON = JSON.stringify(accountToPut);

        let retrunVal = '';
        await axios ({
            method: 'put',
            url: this.backendURL,
            headers: {
                'Content-type': 'application/json'
            },
            data:
                accountJSON
        })
        .then(response => {
            this._logger.debug('got the response from the put: ' + response.data);
            returnVal = response.data;
        })
        .catch(error => {
            this._logger.error('got the error from attempting to put an account: ' + error);
        });

        return returnVal;
    }

    /**
     * Helper method used to call the backends "POST" endpoint
     * @param {Account} accountToPut Account to be posted to the backend
     */
    async _postAccount(accountToPost) {
        let accountJSON = JSON.stringify(accountToPost);

        let returnVal = false;
        await axios({
            method: 'post',
            url: this.backendURL + accountToPost.id,
            headers: {
                'Content-type': 'application/json'
            },
            data:
                accountJSON
        })
        .then(response => {
            this._logger.debug('got the response: ' + JSON.stringify(response));
            if (response.status === 200) {
                this._logger.debug('Successfully posted the account!');
                returnVal = true;
            }
            else {
                this._logger.warn('got a negative status back from posting the account: ' + response.status);
            }
        })
        .catch(error => {
            this._logger.error('got an error attemptign to post an ccount: ' + error);
        });

        return returnVal;
    }

    /**
     * Helper method used to call the backends "DELETE" endpoint
     * @param {String} accountToPut String containing the UUID to be passed to the DELETE endpoint
     */
    async _deleteAccount(idToDelete) {
        this._logger.debug('Deleting account with id: ' + idToDelete);

        let returnVal = false;
        axios({
            method: 'DELETE',
            url: this.backendURL + idToDelete
        })
        .then(response => {
            this._logger.debug('Got a return value of: ' + response.data);
            if (response.data === 1) {
                returnVal = true;
            }
            else {
                this._logger.error('Failed to delete account with id: ' + idToDelete + ' response was: ' + response.data);
            }
        })
        .catch(error => {
            this._logger.error('Got an error attempting to delete with account with id: ' + idToDelete + ' error was: ' + error);
        });

        return returnVal;
    }

    /**
     * Determines the overall total based on all of the accounts
     */
    async determineTotal() {
        this._logger.debug('Determining the total for all accounts');
        let total = 0;
        this.accountsArray.forEach(account=> {
            total += account.amount;
        });

        this.accountsTotal = total.toFixed(2);
        this._logger.debug('Calculated the value: ' + this.accountsTotal);
    }
}

export default AccountModel;