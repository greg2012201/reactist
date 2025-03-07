import * as React from 'react'

import { Columns, Column } from '../../src/new-components/columns'
import { Stack } from '../../src/new-components/stack'
import { Heading } from '../../src/new-components/heading'
import { Box } from '../../src/new-components/box'
import './styles/color-story.less'

export default {
    title: 'Design tokens/Colors',
}

const frameworkFillColors = [
    '--reactist-framework-fill-background',
    '--reactist-framework-fill-crest',
    '--reactist-framework-fill-selected',
    '--reactist-framework-fill-summit',
]

const frameworkBorderColors = [
    '--reactist-divider-primary',
    '--reactist-divider-secondary',
    '--reactist-divider-tertiary',
]

const contentColors = [
    '--reactist-content-primary',
    '--reactist-content-secondary',
    '--reactist-content-tertiary',
    '--reactist-toast-content-primary',
]

function Swatch({ color }: { color: string }) {
    return (
        <Columns key={color} alignY="center" space="small">
            <Column width="content">
                <Box style={{ background: `var(${color})` }} className="color_swatch" />
            </Column>
            <Column>
                <code className="color_swatch__css_variable">{color}</code>
            </Column>
        </Columns>
    )
}

export function Colors() {
    return (
        <Stack space="xlarge" exceptionallySetClassName="story">
            <Heading level={1} size="larger">
                Framework
            </Heading>

            <Heading level={2}>Framework-Fill</Heading>
            <Stack space="small">
                {frameworkFillColors.map((color) => (
                    <Swatch color={color} key={color} />
                ))}
            </Stack>

            <Heading level={2}>Framework-Border</Heading>
            <Stack space="small">
                {frameworkBorderColors.map((color) => (
                    <Swatch color={color} key={color} />
                ))}
            </Stack>

            <Heading level={1} size="larger">
                Content
            </Heading>
            <Stack space="small">
                {contentColors.map((color) => (
                    <Swatch color={color} key={color} />
                ))}
            </Stack>
        </Stack>
    )
}
