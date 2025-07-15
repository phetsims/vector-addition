// Copyright 2019-2025, University of Colorado Boulder

/**
 * SumCheckbox is the checkbox labeled 'Sum', used to control visibility of a sum vector.
 *
 * @author Brandon Li
 */

import Property from '../../../../axon/js/Property.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionCheckbox, { VectorAdditionCheckboxOptions } from './VectorAdditionCheckbox.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ArrowOverSymbolNode from './ArrowOverSymbolNode.js';
import VectorAdditionSymbols from '../VectorAdditionSymbols.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';

type SelfOptions = {

  // Fill and stroke from the vector icon.
  vectorIconFill: TColor;
  vectorIconStroke: TColor;

  // Symbol for the sum vector that is shown in the visual UI.
  sumSymbolProperty?: TReadOnlyProperty<string>;

  // Description of the sum vector in the non-visual UI.
  sumSymbolDescriptionProperty?: TReadOnlyProperty<string>;

  // Use this if you have multiple Sum checkboxes and want to align their vectorIcons.
  // It makes labelNode (the text components of the checkbox) have the same effective size.
  alignGroup?: AlignGroup;
};

export type SumCheckboxOptions = SelfOptions &
  PickOptional<VectorAdditionCheckboxOptions, 'accessibleName'> &
  PickRequired<VectorAdditionCheckboxOptions, 'tandem'>;

export default class SumCheckbox extends VectorAdditionCheckbox {

  public constructor( sumVisibleProperty: Property<boolean>, providedOptions: SumCheckboxOptions ) {

    const options = optionize<SumCheckboxOptions, SelfOptions, VectorAdditionCheckboxOptions>()( {

      // SelfOptions
      sumSymbolProperty: VectorAdditionSymbols.sStringProperty,
      sumSymbolDescriptionProperty: VectorAdditionSymbols.sStringProperty,
      alignGroup: new AlignGroup(),

      // VectorAdditionCheckboxOptions
      accessibleName: VectorAdditionStrings.a11y.sumCheckbox.accessibleNameStringProperty // "Vector Sum"
    }, providedOptions );

    // "Show or hide vector {{sumVectorSymbol}}."
    options.accessibleHelpText = new PatternStringProperty( VectorAdditionStrings.a11y.sumCheckbox.accessibleHelpTextStringProperty, {
      sumVectorSymbol: options.sumSymbolDescriptionProperty
    } );

    // "Vector {{sumVectorSymbol}} shown in graph area."
    options.accessibleContextResponseChecked = new PatternStringProperty( VectorAdditionStrings.a11y.sumCheckbox.accessibleContextResponseCheckedStringProperty, {
      sumVectorSymbol: options.sumSymbolDescriptionProperty
    } );

    // "Vector {{sumVectorSymbol}} hidden in graph area."
    options.accessibleContextResponseUnchecked = new PatternStringProperty( VectorAdditionStrings.a11y.sumCheckbox.accessibleContextResponseUncheckedStringProperty, {
      sumVectorSymbol: options.sumSymbolDescriptionProperty
    } );

    const textNode = new Text( VectorAdditionStrings.sumStringProperty, {
      font: VectorAdditionConstants.CHECKBOX_FONT,
      maxWidth: 75 // determined empirically
    } );

    const leftParenNode = new Text( '(', {
      font: VectorAdditionConstants.CHECKBOX_FONT
    } );

    const rightParenNode = new Text( ')', {
      font: VectorAdditionConstants.CHECKBOX_FONT
    } );

    const arrowOverSymbolNode = new ArrowOverSymbolNode( options.sumSymbolProperty, {
      maxWidth: 95 // determined empirically
    } );

    // The label is all of the text elements
    const parenSpace = 2; // space inside parentheses
    const labelNode = options.alignGroup.createBox( new HBox( {
      align: 'origin', // so that text baselines are aligned
      children: [ textNode, new HStrut( 6 ), leftParenNode, new HStrut( parenSpace ), arrowOverSymbolNode, new HStrut( parenSpace ), rightParenNode ]
    } ) );

    const vectorIcon = VectorAdditionIconFactory.createVectorIcon( 35, {
      fill: options.vectorIconFill,
      stroke: options.vectorIconStroke
    } );

    // The label and vector icon
    const labelAndIconNode = new HBox( {
      spacing: 10,
      children: [ labelNode, vectorIcon ]
    } );

    // Wrap in a Node so that space does not get introduced between elements when the checkbox layout is stretched.
    const content = new Node( {
      children: [ labelAndIconNode ]
    } );

    super( sumVisibleProperty, content, options );
  }
}

vectorAddition.register( 'SumCheckbox', SumCheckbox );