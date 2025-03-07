import * as React from 'react'
import classNames from 'classnames'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import FocusLock from 'react-focus-lock'

import { CloseIcon } from '../icons/close-icon'
import { Column, Columns } from '../columns'
import { Inline } from '../inline'
import { Divider } from '../divider'
import { Box } from '../box'
import { Button, ButtonProps } from '../button'

import styles from './modal.module.css'

type ModalWidth = 'small' | 'medium' | 'large' | 'xlarge' | 'full'
type ModalHeightMode = 'expand' | 'fitContent'

//
// ModalContext
//

type ModalContextValue = {
    onDismiss?(this: void): void
    height: ModalHeightMode
}

const ModalContext = React.createContext<ModalContextValue>({
    onDismiss: undefined,
    height: 'fitContent',
})

//
// Modal container
//

type DivProps = Omit<
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'className' | 'children' | `aria-label` | `aria-labelledby`
>

export type DeprecatedModalProps = DivProps & {
    /**
     * The content of the modal.
     */
    children: React.ReactNode
    /**
     * Whether the modal is open and visible or not.
     */
    isOpen: boolean
    /**
     * Called when the user triggers closing the modal.
     */
    onDismiss?(): void
    /**
     * A descriptive setting for how wide the modal should aim to be, depending on how much space
     * it has on screen.
     * @default 'medium'
     */
    width?: ModalWidth
    /**
     * A descriptive setting for how tall the modal should aim to be.
     *
     * - 'expand': the modal aims to fill most of the available screen height, leaving only a small
     *   padding above and below.
     * - 'fitContent': the modal shrinks to the smallest size that allow it to fit its content.
     *
     * In either case, if content does not fit, the content of the main body is set to scroll
     * (provided you use `ModalBody`) so that the modal never has to strech vertically beyond the
     * viewport boundaries.
     *
     * If you do not use `ModalBody`, the modal still prevents overflow, and you are in charge of
     * the inner layout to ensure scroll, or whatever other strategy you may want.
     */
    height?: ModalHeightMode
    /**
     * Whether to set or not the focus initially to the first focusable element inside the modal.
     */
    autoFocus?: boolean
    /**
     * A escape hatch in case you need to provide a custom class name to the container element.
     */
    exceptionallySetClassName?: string
    /** Defines a string value that labels the current modal for assistive technologies. */
    'aria-label'?: string
    /** Identifies the element (or elements) that labels the current modal for assistive technologies. */
    'aria-labelledby'?: string
}

function isNotInternalFrame(element: HTMLElement) {
    return !(element.ownerDocument === document && element.tagName.toLowerCase() === 'iframe')
}

/**
 * Renders a modal that sits on top of the rest of the content in the entire page.
 *
 * Follows the WAI-ARIA Dialog (Modal) Pattern.
 *
 * @see DeprecatedModalHeader
 * @see DeprecatedModalFooter
 * @see DeprecatedModalBody
 * @deprecated
 */
export function DeprecatedModal({
    isOpen,
    onDismiss,
    height = 'fitContent',
    width = 'medium',
    exceptionallySetClassName,
    autoFocus = true,
    children,
    ...props
}: DeprecatedModalProps) {
    const contextValue: ModalContextValue = React.useMemo(() => ({ onDismiss, height }), [
        onDismiss,
        height,
    ])

    return (
        <DialogOverlay
            isOpen={isOpen}
            onDismiss={onDismiss}
            dangerouslyBypassFocusLock // We're setting up our own focus lock below
            className={classNames(styles.overlay, styles[height], styles[width])}
            data-testid="modal-overlay"
        >
            <FocusLock autoFocus={autoFocus} whiteList={isNotInternalFrame} returnFocus={true}>
                <DialogContent
                    {...props}
                    as={Box}
                    borderRadius="full"
                    background="default"
                    display="flex"
                    flexDirection="column"
                    overflow="hidden"
                    height={height === 'expand' ? 'full' : undefined}
                    flexGrow={height === 'expand' ? 1 : 0}
                    className={[exceptionallySetClassName, styles.container]}
                >
                    <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>
                </DialogContent>
            </FocusLock>
        </DialogOverlay>
    )
}

//
// ModalCloseButton
//

export type DeprecatedModalCloseButtonProps = Omit<
    ButtonProps,
    | 'type'
    | 'children'
    | 'variant'
    | 'icon'
    | 'startIcon'
    | 'endIcon'
    | 'disabled'
    | 'loading'
    | 'tabIndex'
    | 'width'
    | 'align'
> & {
    /**
     * The descriptive label of the button.
     */
    'aria-label': string
}

/**
 * The close button rendered by ModalHeader. Provided independently so that consumers can customize
 * the button's label.
 *
 * @see DeprecatedModalHeader
 */
export function DeprecatedModalCloseButton(props: DeprecatedModalCloseButtonProps) {
    const { onDismiss } = React.useContext(ModalContext)
    const [includeInTabOrder, setIncludeInTabOrder] = React.useState(false)
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(
        function skipAutoFocus() {
            if (isMounted) {
                setIncludeInTabOrder(true)
            } else {
                setIsMounted(true)
            }
        },
        [isMounted],
    )

    return (
        <Button
            {...props}
            variant="quaternary"
            onClick={onDismiss}
            icon={<CloseIcon />}
            tabIndex={includeInTabOrder ? 0 : -1}
        />
    )
}

//
// ModalHeader
//

export type DeprecatedModalHeaderProps = DivProps & {
    /**
     * The content of the header.
     */
    children: React.ReactNode
    /**
     * Allows to provide a custom button element, or to omit the close button if set to false.
     * @see DeprecatedModalCloseButton
     */
    button?: React.ReactNode | boolean
    /**
     * Whether to render a divider line below the header.
     * @default false
     */
    withDivider?: boolean
    /**
     * A escape hatch in case you need to provide a custom class name to the container element.
     */
    exceptionallySetClassName?: string
}

/**
 * Renders a standard modal header area with an optional close button.
 *
 * @see DeprecatedModal
 * @see DeprecatedModalFooter
 * @see DeprecatedModalBody
 */
export function DeprecatedModalHeader({
    children,
    button = true,
    withDivider = false,
    exceptionallySetClassName,
    ...props
}: DeprecatedModalHeaderProps) {
    return (
        <>
            <Box
                {...props}
                as="header"
                paddingLeft="large"
                paddingRight={button === false || button === null ? 'large' : 'small'}
                paddingY="small"
                className={exceptionallySetClassName}
            >
                <Columns space="large" alignY="center">
                    <Column width="auto">{children}</Column>
                    {button === false || button === null ? (
                        <div className={styles.headerContent} />
                    ) : (
                        <Column
                            width="content"
                            exceptionallySetClassName={styles.buttonContainer}
                            data-testid="button-container"
                        >
                            {typeof button === 'boolean' ? (
                                <DeprecatedModalCloseButton
                                    aria-label="Close modal"
                                    autoFocus={false}
                                />
                            ) : (
                                button
                            )}
                        </Column>
                    )}
                </Columns>
            </Box>
            {withDivider ? <Divider /> : null}
        </>
    )
}

//
// ModalBody
//

export type DeprecatedModalBodyProps = DivProps & {
    /**
     * The content of the modal body.
     */
    children: React.ReactNode
    /**
     * A escape hatch in case you need to provide a custom class name to the container element.
     */
    exceptionallySetClassName?: string
}

/**
 * Renders the body of a modal.
 *
 * Convenient to use alongside ModalHeader and/or ModalFooter as needed. It ensures, among other
 * things, that the contet of the modal body expands or contracts depending on the modal height
 * setting or the size of the content. The body content also automatically scrolls when it's too
 * large to fit the available space.
 *
 * @see DeprecatedModal
 * @see DeprecatedModalHeader
 * @see DeprecatedModalFooter
 */
export function DeprecatedModalBody({
    exceptionallySetClassName,
    children,
    ...props
}: DeprecatedModalBodyProps) {
    const { height } = React.useContext(ModalContext)
    return (
        <Box
            {...props}
            className={exceptionallySetClassName}
            flexGrow={height === 'expand' ? 1 : 0}
            height={height === 'expand' ? 'full' : undefined}
            overflow="auto"
        >
            <Box padding="large" paddingBottom="xxlarge">
                {children}
            </Box>
        </Box>
    )
}

//
// ModalFooter
//

export type DeprecatedModalFooterProps = DivProps & {
    /**
     * The contant of the modal footer.
     */
    children: React.ReactNode
    /**
     * Whether to render a divider line below the footer.
     * @default false
     */
    withDivider?: boolean
    /**
     * A escape hatch in case you need to provide a custom class name to the container element.
     */
    exceptionallySetClassName?: string
}

/**
 * Renders a standard modal footer area.
 *
 * @see DeprecatedModal
 * @see DeprecatedModalHeader
 * @see DeprecatedModalBody
 */
export function DeprecatedModalFooter({
    exceptionallySetClassName,
    withDivider = false,
    ...props
}: DeprecatedModalFooterProps) {
    return (
        <>
            {withDivider ? <Divider /> : null}
            <Box as="footer" {...props} className={exceptionallySetClassName} padding="large" />
        </>
    )
}

//
// ModalActions
//

export type DeprecatedModalActionsProps = DeprecatedModalFooterProps

/**
 * A specific version of the ModalFooter, tailored to showing an inline list of actions (buttons).
 * @see DeprecatedModalFooter
 */
export function DeprecatedModalActions({ children, ...props }: DeprecatedModalActionsProps) {
    return (
        <DeprecatedModalFooter {...props}>
            <Inline align="right" space="large">
                {children}
            </Inline>
        </DeprecatedModalFooter>
    )
}
