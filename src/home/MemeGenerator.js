import {useEffect, useState} from 'react';
import qs from 'qs';

export const MemeGenerator = () => {
    const [templates, setTemplates] = useState([])
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [boxes, setBoxes] = useState([])
    const [generatedMeme, setGeneratedMeme] = useState(null)

    useEffect(() => {
        (async () => {
            const requisition = await fetch("https://api.imgflip.com/get_memes")
            const { data: { memes } } = await requisition.json()
            setTemplates(memes)
        })()
    }, [])

    const handleInputChange = (index) => (e) => {
        const newValues = boxes
        newValues[index] = e.target.value
        setBoxes(newValues)
    }
      
    function handleSelectTemplate(template) {
        setSelectedTemplate(template)
        setBoxes([])
    }

    async function handleSubmit(e) {
        e.preventDefault()
      
        const params = qs.stringify({
          template_id: selectedTemplate.id,
          username: 'Memegeneratorreact',
          password: 'memereact',
          boxes: boxes.map(text => ({ text }))
        })
      
        const resp = await fetch(`https://api.imgflip.com/caption_image?${params}`)
        const { data: { url } } = await resp.json()
      
        setGeneratedMeme(url)
    }

    function handleDownloadMeme() {
        setSelectedTemplate(null)
        setGeneratedMeme(null)
        setBoxes([])
    }

    return(
        <div className="card">
            {generatedMeme && (
                <>
                    <img src={generatedMeme} alt="Generated Meme" className="generated-meme" />
                    <button type="button" className="button" onClick={handleDownloadMeme}>Baixar Meme</button>
                </>
            )}

            {!generatedMeme && (
                <>
                    <h2>Select a Template</h2>
                    <div className="templates">
                        {templates.map((template) => (
                            <button
                                key={template.id}
                                type="button"
                                onClick={() => handleSelectTemplate(template)}
                                className={template.id === selectedTemplate?.id ? "selected" : ""}
                            >
                            <img src={template.url} alt={template.name} />
                            </button>
                        ))}
                    </div>

            
                    {selectedTemplate && (
                        <>
                            <h2>Texts</h2>
                            <form onSubmit={handleSubmit}>
                                {(new Array(selectedTemplate.box_count).fill("").map((_, index) => (
                                    <input 
                                        key={String(Math.random())}
                                        placeholder={`Text #${index + 1}`}
                                        onChange={handleInputChange(index)}
                                    />
                                )))}
                    
                                <button type="submit" className="button">Make Meme</button>
                            </form>
                        </>
                    )}
                </>
            )}
      </div>
    )
}