import * as React from 'react'
import flattenChildren from 'react-keyed-flatten-children'
import { polymorphicComponent } from '../../utils/polymorphism'
import { mapResponsiveProp } from '../responsive-props'
import { Box } from '../box'
import { Divider } from '../divider'

import type { ResponsiveProp } from '../responsive-props'
import type { DividerWeight, Space } from '../common-types'
import type { BoxProps, ReusableBoxProps } from '../box'

type Align = 'start' | 'center' | 'end'

interface StackProps extends ReusableBoxProps {
    /** Space between items */
    space?: ResponsiveProp<Space>
    /** Align items horizontally */
    align?: ResponsiveProp<Align>
    /** The weight of the dividers to add. Defaults to 'none', which means no dividers are added */
    dividers?: DividerWeight
}

const Stack = polymorphicComponent<'div', StackProps>(function Stack(
    {
        as,
        space,
        align,
        dividers = 'none',
        width = 'full',
        children,
        exceptionallySetClassName,
        ...props
    },
    ref,
) {
    const alignItems: BoxProps['alignItems'] =
        align === undefined
            ? undefined
            : mapResponsiveProp(align, (align) =>
                  align === 'start' ? 'flexStart' : align === 'end' ? 'flexEnd' : 'center',
              )

    return (
        <Box
            {...props}
            display="flex"
            flexDirection="column"
            width={width}
            alignItems={alignItems}
            gap={space}
            as={as}
            className={exceptionallySetClassName}
            ref={ref}
        >
            {dividers !== 'none'
                ? React.Children.map(flattenChildren(children), (child, index) =>
                      index > 0 ? (
                          <>
                              <Divider weight={dividers} />
                              {child}
                          </>
                      ) : (
                          child
                      ),
                  )
                : children}
        </Box>
    )
})

export type { StackProps }
export { Stack }
