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

type SelfOptions = {
  vectorIconFill: TColor;
  vectorIconStroke: TColor;
  sumSymbolProperty?: TReadOnlyProperty<string>;
};

export type SumCheckboxOptions = SelfOptions &
  PickOptional<VectorAdditionCheckboxOptions, 'accessibleName' | 'accessibleHelpText'> &
  PickRequired<VectorAdditionCheckboxOptions, 'tandem'>;

export default class SumCheckbox extends VectorAdditionCheckbox {

  public constructor( sumVisibleProperty: Property<boolean>, providedOptions: SumCheckboxOptions ) {

    const options = optionize<SumCheckboxOptions, SelfOptions, VectorAdditionCheckboxOptions>()( {

      // SelfOptions
      sumSymbolProperty: VectorAdditionSymbols.sStringProperty,

      // VectorAdditionCheckboxOptions
      accessibleName: VectorAdditionStrings.a11y.sumCheckbox.accessibleNameStringProperty,
      accessibleHelpText: VectorAdditionStrings.a11y.sumCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: VectorAdditionStrings.a11y.sumCheckbox.accessibleContextResponseCheckedStringProperty,
      accessibleContextResponseUnchecked: VectorAdditionStrings.a11y.sumCheckbox.accessibleContextResponseUncheckedStringProperty
    }, providedOptions );

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
    const labelNode = new HBox( {
      align: 'origin', // so that text baselines are aligned
      children: [ textNode, new HStrut( 6 ), leftParenNode, arrowOverSymbolNode, rightParenNode ]
    } );

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