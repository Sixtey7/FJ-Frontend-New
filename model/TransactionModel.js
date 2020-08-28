import axios from 'axios';
import TxHelper from '../utils/TxHelper';
const consola = require('consola');

const URL_SUFFIX = '/transactions/';
/**
 * Model class used to manage and interact with Transaction objects
 * 
 * Serves as the priamry interaction point with the backend
 */
class TransactionModel {
    txArray;
    _txHelper;
    _logger;

    /**
     * Builds the Transaction Model.  Queries the backend for the initial transaction list
     * @param {Object} logger Logger object to be used for the class
     * @param {String} backendHost Hostname to find the backend at
     */
    constructor(backendHost) {
        this._logger = consola;
        this._logger.debug('running transaction model constructor!');
        this.backendURL = 'http://' + backendHost + URL_SUFFIX;
        this._txHelper = new TxHelper(consola);
        this.txArray = new Array();

        // Query the backend to get the current transaction objects
        axios
            .get(this.backendURL)
            .then(response => {
                this.txArray = this._txHelper.massageTransactions(response.data);
                this._logger.debug('got ' + this.txArray.length + ' transactions!');

                this._logger.debug('finished standing up the Tx model!');
            });
    }

    /**
     * Saves the provided Transaction (update or add) to both the collection and the backend
     * @param {Transaction} txToSave The transaction to be persisted
     */
    async saveTx(txToSave) {
        // detemrine if this is an existing transaction or a new one
        if (txToSave.id) {
            this._logger.debug('saving an edited transaction: ' + JSON.stringify(txToSave))

            let returnVal = await this._postTx(txToSave);

            if (returnVal) {
                this.txArray = await this._txHelper.mergeTxIntoArray(txToSave, this.txArray);
            }
            else {
                this._logger.error('failed to post the transaction!');
            }
        }
        else {
            this._logger.debug('adding a new transaction: ' + JSON.stringify(txToSave));

            let returnVal = await this._putTx(txToSave);

            if (returnVal) {
                txToSave.id = returnVal;
                this.txArray.push(txToSave);
            }        
            else {
                this._logger.error('failed to put the transaction for: ' + JSON.stringify(txToSave));
            }
        }
    }

    /**
     * Deletes the transaction with the provided ID from both the cache and the backend
     * @param {String} idToDelete String containing the UUID to be deleted
     */
    async deleteTx(idToDelete) {
        this._logger.debug('Deleting a transaction with id: ' + idToDelete);

        let returnVal = await this._deleteTx(idToDelete);

        if (returnVal) {
            let index = this.txArray.findIndex(tx => {
                return tx.id === idToDelete;
            });

            if (index >= 0) {
                this._logger.debug('found the index: ' + index);
                this.txArray.splice(index, 1);
            }
            else {
                this._logger.warn('failed to find the index in the array for transaction: ' + idToDelete);
            }
        }
    }

    /**
     * Helper method used to call the backends "PUT" endpoint
     * @param {Transaction} txToPut Transaction to be put to the backend
     */
    async _putTx(txToPut) {
        // need to delete the empty id to prevent the backend from trying to handle it
        delete txToPut.id;
        let txJSON = JSON.stringify(txToPut);

        let retrunVal = '';
        await axios ({
            method: 'put',
            url: this.backendURL,
            headers: {
                'Content-type': 'application/json'
            },
            data:
                txJSON
        })
        .then(response => {
            this._logger.debug('got the response from the put: ' + response.data);
            returnVal = response.data;
        })
        .catch(error => {
            this._logger.error('got the error from attempting to put a transaction: ' + error);
        });

        return returnVal;
    }

    /**
     * Helper method used to call the backends "POST" endpoint
     * @param {Transaction} txToPost Transaction to be posted to the backend
     */
    async _postTx(txToPost) {
        let txJSON = JSON.stringify(txToPost);

        let returnVal = false;
        await axios({
            method: 'post',
            url: this.backendURL + txToPost.id,
            headers: {
                'Content-type': 'application/json'
            },
            data:
                txJSON
        })
        .then(response => {
            this._logger.debug('got the response: ' + JSON.stringify(response));
            if (response.status === 200) {
                this._logger.debug('Successfully posted the transaction!');
                returnVal = true;
            }
            else {
                this._logger.warn('got a negative status back from posting the transaction: ' + response.status);
            }
        })
        .catch(error => {
            this._logger.error('got an error attemptign to post a transaction: ' + error);
        });

        return returnVal;
    }

    /**
     * Helper method used to call the backends "DELETE" endpoint
     * @param {String} idToDelete String containing the UUID to be passed to the DELETE endpoint
     */
    async _deleteTx(idToDelete) {
        this._logger.debug('Deleting transaction with id: ' + idToDelete);

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
                this._logger.error('Failed to delete transaction with id: ' + idToDelete + ' response was: ' + response.data);
            }
        })
        .catch(error => {
            this._logger.error('Got an error attempting to delete with transaction with id: ' + idToDelete + ' error was: ' + error);
        });

        return returnVal;
    }

}

export default TransactionModel;