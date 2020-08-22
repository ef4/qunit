// Helper for the QUnit release preparation commit.
//
// See also RELEASE.md.
//
// Inspired by <https://github.com/jquery/jquery-release>.

/* eslint-env node */

const fs = require( "fs" );
const path = require( "path" );
const util = require( "util" );
const gitAuthors = require( "grunt-git-authors" );

const Repo = {
	async prep( version ) {
		if ( typeof version !== "string" || !/^\d+\.\d+\.\d+$/.test( version ) ) {
			throw new Error( "Invalid or missing version argument" );
		}
		{
			const file = "package.json";
			console.log( `Updating ${file}...` );
			const json = fs.readFileSync( __dirname + "/../" + file, "utf8" );
			const packageIndentation = json.match( /\n([\t\s]+)/ )[ 1 ];
			const data = JSON.parse( json );

			data.version = `${version}-pre`;

			fs.writeFileSync(
				__dirname + "/../" + file,
				JSON.stringify( data, null, packageIndentation ) + "\n"
			);
		}
		{
			const file = "AUTHORS.txt";
			console.log( `Updating ${file}...` );
			const updateAuthors = util.promisify( gitAuthors.updateAuthors );
			await updateAuthors( {
				dir: path.dirname( __dirname ),
				filename: file,
				banner: "Authors ordered by first contribution"
			} );
		}
	}
};

const version = process.argv[ 2 ];

( async function main() {
	await Repo.prep( version );
}() ).catch( e => {
	console.error( e.toString() );
	process.exit( 1 );
} );
