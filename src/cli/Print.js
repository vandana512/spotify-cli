import Table from 'cli-table3'
import chalk from 'chalk'
import inquirer from 'inquirer'

export function printSearchResult(items) {
    const table = new Table({
        head: [chalk.blue('#'), chalk.green('Title'), chalk.yellow('Artist'), chalk.yellow('Album'), chalk.yellow('Duration')],
        colWidths: [4, 30, 30, 25, 10]
    })
    
    items.forEach((track, index) => {
        const name = track.name
        const artist = track.artists.map(a => a.name).join(', ')
        table.push([index+1, name, artist, track.album.name, (track.duration_ms/60000).toFixed(2)])
    })
    
    console.log(table.toString())
}

export async function trackSelector(items) {
    const choices = items.map((track, i) => ({
        name: `${chalk.green(i + 1)}   ${chalk.white(track.name).padEnd(35)}   ${chalk.gray('---')}   ${chalk.magenta(track.artists.map(artist => artist.name).join(', ').padEnd(30))}    ${chalk.yellow((track.duration_ms/60000).toFixed(2))} ${chalk.yellow('minutes')} `,
        value: track
    }))
    
    choices.push({
        name: `${chalk.green(items.length + 1)}   ${chalk.redBright.bold("Search Again")}`,
        value: 'again'
    })

    const { selectedTrack } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedTrack',
            message: 'Select a song:',
            choices
        }
    ])

    if(selectedTrack === 'again') {
        return 101
    }

    return selectedTrack
}