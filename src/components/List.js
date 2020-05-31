import React from 'react'
import Card from './Card'

const List = ({ lista }) => (
    <div>
        {
            lista.map((element) => {
                return (
                    <Card
                        key={element.id}
                        idp={element.id}
                        title={element.name}
                        description={element.origin.name}
                        img={element.image}
                        leftColor="#E37222"
                        rightColor="#07889B"
                    />
                )
            })
        }
    </div>
)

export default List