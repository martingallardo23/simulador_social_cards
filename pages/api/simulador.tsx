import Image from 'next/image';
import { NextRequest, ImageResponse } from 'next/server';
import candidateData from '../../assets/candidates.json';
import partyData from '../../assets/parties.json';

export const config = {
    runtime: 'edge',
}

export function hexToRgb(hex, opacity) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})` : null;
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default async function handler(req: NextRequest) {
    try {
        
        const { searchParams } = new URL(req.url)
        
        const fontDataMedium = await fetch(
            new URL('../../assets/ZillaSlab-Medium.ttf', import.meta.url),
            ).then((res) => res.arrayBuffer());
            
            const fontDataBold = await fetch(
            new URL('../../assets/ZillaSlab-Bold.ttf', import.meta.url),
            ).then((res) => res.arrayBuffer());
            
            const winner = searchParams.has('winner') ? capitalizeFirstLetter(searchParams.get('winner')) : null
            const winnerLink ='https://vercel-og-nextjs-omega-six.vercel.app//assets/img/'+ winner + '.jpg';
            const round = searchParams.get('round') == 'first' ? 'Primera Vuelta' : 'Ballotage'
            const roundBackground = round == 'Primera Vuelta' ? '#ffe864' : '#e2f1f3'
            const loser = searchParams.has('loser') && round == "Ballotage" ? searchParams.get('loser') : null
            const loserLink ='https://vercel-og-nextjs-omega-six.vercel.app/assets/img/'+ loser + '.jpg';
            
            // find the party by finding the candidate name in the candidatedata json
            const partyShort = candidateData.find((candidate: any) => candidate.name == winner).party
            const party = partyData.find((party: any) => party.name == partyShort).name_long
            const percentage = searchParams.has('percentage') ? searchParams.get('percentage') : null
            const backgroundColorHEX = partyData.find((party: any) => party.name == partyShort).color
            //change backgroundColor to rgba
            const backgroundColor = hexToRgb(backgroundColorHEX, 0.4)


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
                    overflow: 'hidden', // to make borderRadius apply to the image
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
                        {round + "s"}
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
