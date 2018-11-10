import { JolocomLib } from 'jolocom-lib'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { CredentialRequestPayload } from 'jolocom-lib/js/interactionFlows/credentialRequest/credentialRequestPayload';

import { ssoActions } from '../../../src/actions'
import { StateCredentialRequestSummary } from '../../../src/reducers/sso/'

describe('SSO action creators', () => {
    const initialState = {
        account: {
            claims: {
                toJS: () => {
                    return {
                        loading: false,
                        selected: {
                            credentialType: 'Email',
                            claimData: {
                                email: 'kielsoft@gmail.com'
                            },
                            id: '',
                            issuer: 'did:jolo:test',
                            subject: 'did:jolo:test'
                        },
                        pendingExternal: [],
                        decoratedCredentials: 'blah'
                    }
                }
            },
            did: {
                toJS: () => ({ did: 'mock:did:test' })
            }
        },
        activeCredentialRequest: {
            requester: '',
            callbackURL: '',
            availableCredentials: []
        }
    }

    const mockStore = configureStore([thunk])(initialState)
    const encodedJwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJjcmVkZW50aWFsUmVxdWVzdCI6eyJjcmVkZW50aWFsUmVxdWlyZW1lbnRzIjpbeyJ0eXBlIjpbIkNyZWRlbnRpYWwiLCJQcm9vZk9mRW1haWxDcmVkZW50aWFsIl0sImNvbnN0cmFpbnRzIjp7ImFuZCI6W3siPT0iOlt0cnVlLHRydWVdfSx7Ij09IjpbdHJ1ZSx0cnVlXX1dfX0seyJ0eXBlIjpbIkNyZWRlbnRpYWwiLCJQcm9vZk9mTmFtZUNyZWRlbnRpYWwiXSwiY29uc3RyYWludHMiOnsiYW5kIjpbeyI9PSI6W3RydWUsdHJ1ZV19LHsiPT0iOlt0cnVlLHRydWVdfV19fV0sImNhbGxiYWNrVVJMIjoiaHR0cDovL2xvY2FsaG9zdDo5MDAwL2F1dGhlbnRpY2F0aW9uLzJhM2hnIn0sInR5cCI6ImNyZWRlbnRpYWxSZXF1ZXN0IiwiaWF0IjoxNTQxODY3OTE5MTI5LCJpc3MiOiJkaWQ6am9sbzpiMzEwZDI5M2FlYWM4YTVjYTY4MDIzMmI5NjkwMWZlODU5ODhmZGUyODYwYTFhNWRiNjliNDk3NjI5MjNjYzg4I2tleXMtMSJ9.BIRzU5gHEmEKOEjMvHoDVI4vr7JtK8dw-gYBrvKQThzAibdsdfAuGXOtkzsBp30o2A4HbfPrABf1JwEEOa0zVA"
    let returnedDecodedJwt: CredentialRequestPayload = null;

    beforeEach(async () => {
        mockStore.clearActions()
        returnedDecodedJwt = await JolocomLib.parse.interactionJSONWebToken.decode(encodedJwt)
    })

    it('should set credential request json data', () => {

        const reqSummary: StateCredentialRequestSummary = {
            requester: 'did:jolo:test',
            availableCredentials: [],
            callbackURL: 'http://192.168.8.102:9000/authentication/',
        }

        const action = ssoActions.setCredentialRequest(reqSummary)
        expect(action).toMatchSnapshot();

    }, 30000)

    it('should correctly parse encoded JWT string without any Exception and consumeRedentialRequest', async () => {

        const backendMiddleware = {
            storageLib: {
                get: {
                    persona: jest.fn().mockResolvedValue([{ did: 'mock:did:test' }]),
                    attributesByType: (requestType: string[])=> {
                        switch(requestType[1]){
                            case "ProofOfEmailCredential":
                                return {"type":["Credential","ProofOfEmailCredential"],"results":[{"verification":"claimId:dcc4ced746f83","values":["kielsoft@gmail.com"],"fieldName":"email"}]};
                            
                            case "ProofOfNameCredential":
                                return {"type":["Credential","ProofOfNameCredential"],"results":[{"verification":"claimId:262cda78bfe26","values":["Olayode","Ezekiel"],"fieldName":"givenName"}]};
                            
                        }
                        return {"results":[]}
                    },
                    verifiableCredential: jest.fn().mockResolvedValue([])
                }
            }
        }

        await ssoActions.consumeCredentialRequest(returnedDecodedJwt)(mockStore.dispatch, mockStore.getState, backendMiddleware)
        expect(mockStore.getActions()).toMatchSnapshot()

    }, 30000)

})