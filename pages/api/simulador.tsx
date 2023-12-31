import { NextRequest, ImageResponse } from 'next/server';
import candidateData from '../../assets/candidates.json';
import partyData from '../../assets/parties.json';

export const config = {
    runtime: 'edge',
}

export function mixWithWhite(hex: string, factor: number): string {
    // Ensure factor is between 0 (color unchanged) and 1 (white)
    factor = Math.max(0, Math.min(1, factor));

    // Parse the hex color
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        return null;
    }

    // Extract RGB values
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    // Mix with white
    const mixedR = Math.round(r + (255 - r) * factor);
    const mixedG = Math.round(g + (255 - g) * factor);
    const mixedB = Math.round(b + (255 - b) * factor);

    return `rgb(${mixedR}, ${mixedG}, ${mixedB})`;
}


export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default async function handler(req: NextRequest) {
    try {
        
        const { searchParams } = new URL(req.url)
        
        const fontDataMedium = await fetch(
            new URL('../../assets/ZillaSlab-Medium.ttf', import.meta.url),
            ).then((res) => res.arrayBuffer()
        );
            
        const fontDataBold = await fetch(
            new URL('../../assets/ZillaSlab-Bold.ttf', import.meta.url),
            ).then((res) => res.arrayBuffer()
        );

        const IMAGE_BASE_URL = 'https://vercel-og-nextjs-omega-six.vercel.app/assets/img/';

        const rawWinner = searchParams.get('winner');
        const rawLoser = searchParams.get('loser');
        const rawRound = searchParams.get('round');
        const percentage = searchParams.get('percentage');        

        const winner = rawWinner ? capitalizeFirstLetter(rawWinner) : null;
        const loser = (rawLoser && rawRound === "Ballotage") ? rawLoser : null;
        const round = rawRound === 'first' ? 'Primera Vuelta' : 'Ballotage';
        
        const winnerLink = `${IMAGE_BASE_URL}${winner}.jpg`;
        const loserLink = `${IMAGE_BASE_URL}${loser}.jpg`;
        const roundBackground = round == 'Primera Vuelta' ? '#ffe864' : '#e2f1f3'
        
        const partyShort = candidateData.find((candidate: any) => candidate.name == winner).party
        const party = partyData.find((party: any) => party.name == partyShort).name_long
        const backgroundColorHEX = partyData.find((party: any) => party.name == partyShort).color
        const backgroundColor = mixWithWhite(backgroundColorHEX, 0.5)

    return new ImageResponse(

        (
        <div style={{
            width:'1200px',
            height:'600px',
            display:'flex',
            flexDirection:'row',
            borderRadius:'20px',
            border:'1px solid #333',
            backgroundColor:backgroundColor,
            padding:'30px',
            lineHeight:'normal',
        }}>
             
            <div style={{
                display:'flex',
                width:'38%',
                flexDirection:'column',
                justifyContent:'space-between',
                alignItems:'center'
            }}>
                <div style={{
                    width: '400px',
                    height: '400px',
                    borderRadius: '20px',
                    border: '1px solid #333',
                    display: 'flex',
                    overflow: 'hidden', 
                }}>
                    <img src={winnerLink} alt="Winner"/>
                </div>


                <div style={{
                    marginTop:'10px',
                    display:'flex',
                    height:'100px',
                    flexDirection:'row',
                    justifyContent:'space-between',
                    alignItems:'center'
                }}>
                    {
                    loser
                    ?
                    <div style={{display:'flex', width:"100%", flexDirection:"row", padding:"10px"}}>
                    <div style={{
                        backgroundColor:roundBackground,
                        marginRight:'0px',
                        display:'flex',
                        borderRadius:'20px',
                        border:'1px solid #333',
                        padding:'2px 6px',
                        fontSize: 36,
                        fontStyle: 'normal',
                        height:'100px',
                        alignItems:'center',
                        justifyContent:'center',
                        textAlign:'center',
                        lineHeight: 1.4,
                        flexGrow:1,
                        whiteSpace: 'pre-wrap',
                    }}>
                        {round}
                    </div>

                     <img src={loserLink} style={{
                        borderRadius:'20px',
                        border:'1px solid #333',
                        width:'100px',
                        marginLeft:'10px',
                        height:'100px',
                        }}/>
                    </div>
                    :   <div style={{display:'flex', width:"100%", flexDirection:"row", padding:"10px"}}>
                        <div style={{
                        backgroundColor:roundBackground,
                        marginRight:'0px',
                        display:'flex',
                        borderRadius:'20px',
                        border:'1px solid #333',
                        padding:'2px 6px',
                        fontSize: 36,
                        fontStyle: 'normal',
                        width:'100%',
                        height:'100px',
                        alignItems:'center',
                        justifyContent:'center',
                        textAlign:'center',
                        lineHeight: 1.4,
                        flexGrow:1,
                        whiteSpace: 'pre-wrap',
                        }}>
                            {round}
                        </div>
                    </div>
                    }
                </div>
            </div>
            <div  style={{
                display:'flex',
                marginLeft: '20px',
                flexDirection:'column',
                justifyContent:'space-between',
                width:'62%',
                paddingRight:'30px'
            }}>
                <div style={{display:'flex',
                            flexDirection:'column'}}>
                    <div style={{
                            fontSize: '100px',
                            lineHeight: 1,
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'Zilla Slab Bold',
                        }}>
                            {winner}
                    </div>
                    <div style={{
                        fontSize: '50px',
                        marginTop:'10px',
                        lineHeight:1,
                        whiteSpace: 'pre-wrap',
                    }}>
                        {party}
                    </div>
                </div>
                <div style={{
                    fontSize: '90px',
                    lineHeight:1,
                    width:'100%',
                    border:'1px solid #333',
                    borderRadius:'20px',
                    backgroundColor:'#fff',
                    height:'140px',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    textAlign:'center',
                    paddingBottom:'20px',
                }}>
                    {percentage + '%'}
                    
                </div>
            </div>
        </div>
        ),
        {
            width: 1200,
            height: 600,
            fonts: [
                {
                  name: 'Zilla Slab Medium',
                  data: fontDataMedium,
                  style: 'normal',
                },
                {
                  name: 'Zilla Slab Bold',
                  data: fontDataBold,
                  style: 'normal',
                },

            ]
        }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new ImageResponse((<div>error</div>), {
        status: 500,
    })
  }
}
