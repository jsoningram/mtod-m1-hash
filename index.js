const _         = require( 'lodash' )
const axios     = require( 'axios' )
const papaparse = require( 'papaparse' )
const fs        = require( 'fs-jetpack' )
const env       = process.env.SERVERLESS_ENV
const keys      = require( './keys' )[ env ]

const API_KEY  = keys.apiKey
const FILE     = './email-list.csv'
const NEW_FILE = './new-email-list.csv'

let host = `https://api-halogen.${ env }.motortrendondemand.com/m1`

if ( 'production' === process.env.SERVERLESS_ENV ) {
	host = 'https://api-halogen.motortrendondemand.com/m1'	
}

( async function launch() {
	const fileData = await fs.read( FILE )

    const parsedData       = papaparse.parse( fileData ).data
	const parsedDataLength = parsedData.length - 1
			
	let newData = []

    // write headers
    await writeToFile( [ parsedData[0] ] )

    for ( let i = 1; i < parsedDataLength; i++ ) {
		await new Promise( async next => {
            let row = parsedData[ i ]

			const data = {
                email    : row[0],
                firstname: _.startCase( _.toLower( row[1] ) ),
                lastname : _.startCase( _.toLower( row[2] ) )
            };

			const result = await axios.post(
				`${ host }/hash`,
				data,
				{
					headers: {
						'x-api-key': API_KEY
					}
				}
			).catch( err => console.log( err.message ) )

            console.log( data.email, result.data.data.id )

            row.push( result.data.data.id )

            newData.push( row )

            // write to file
            if ( i % 100 === 0 ) {
                await writeToFile( newData )

                newData = []
            }

            next()
        })
    }

    await writeToFile( newData )


    async function writeToFile( data ) {
        console.log( `Write to file ${ data.length } records` )

        await fs.append( NEW_FILE, papaparse.unparse(data) + '\n' )
    }

    console.log( 'Ready' )
})()
