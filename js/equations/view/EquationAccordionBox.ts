// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationAccordionBox is the accordion box labeled 'Equation' in the 'Equations' screen.
 * It allows the user to select the form of the equation, and change the coefficients of the vectors.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import FixedSizeAccordionBox, { FixedSizeAccordionBoxOptions } from '../../common/view/FixedSizeAccordionBox.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import EquationsVectorSet from '../model/EquationsVectorSet.js';
import { EquationType, EquationTypeValues } from '../model/EquationType.js';
import EquationTypeNode from './EquationTypeNode.js';
import EquationTypeRadioButtonGroup from './EquationTypeRadioButtonGroup.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';

// constants
const TEXT_OPTIONS = { font: VectorAdditionConstants.EQUATION_FONT };

type SelfOptions = EmptySelfOptions;

type EquationAccordionBoxOptions = SelfOptions & FixedSizeAccordionBoxOptions;

export default class EquationAccordionBox extends FixedSizeAccordionBox {

  /**
   * @param vectorSet
   * @param equationTypeProperty
   * @param equationButtonsAlignGroup - used to make all equation radio buttons the same size
   * @param equationsAlignGroup - used to make all interactive equations the same size
   * @param providedOptions
   */
  public constructor( vectorSet: EquationsVectorSet,
                      equationTypeProperty: StringUnionProperty<EquationType>,
                      equationButtonsAlignGroup: AlignGroup,
                      equationsAlignGroup: AlignGroup,
                      providedOptions: EquationAccordionBoxOptions ) {

    const options = optionize<EquationAccordionBoxOptions, SelfOptions, FixedSizeAccordionBoxOptions>()( {

      // FixedSizeAccordionBoxOptions
      contentFixedWidth: 670,
      contentFixedHeight: 50,
      contentXSpacing: 17,
      isDisposable: false
    }, providedOptions );

    // When the accordion box is collapsed, show 'Equation'
    const equationText = new Text( VectorAdditionStrings.equationStringProperty, TEXT_OPTIONS );

    // Radio buttons for selecting equation type
    const equationTypeRadioButtonGroup = new EquationTypeRadioButtonGroup(
      equationTypeProperty, vectorSet.symbolProperties, equationButtonsAlignGroup, {
        tandem: options.tandem.createTandem( 'equationTypeRadioButtonGroup' )
      } );

    // Create an equation of each type, only one of which will be visible at a time.
    const equationsParent = new Node();
    EquationTypeValues.forEach( equationType => {

      const equationTypeNode = new EquationTypeNode( vectorSet, equationType );
      equationsParent.addChild( new AlignBox( equationTypeNode, {
        group: equationsAlignGroup,
        xAlign: 'left'
      } ) );

      // unlink is unnecessary, exists for the lifetime of the sim.
      equationTypeProperty.link( () => {
        equationTypeNode.visible = ( equationType === equationTypeProperty.value );
      } );
    } );

    // Radio buttons on the left, equation on the right. See https://github.com/phetsims/vector-addition/issues/128
    const expandedContent = new HBox( {
      children: [ equationTypeRadioButtonGroup, equationsParent ],
      spacing: 55
    } );

    super( expandedContent, equationText, options );

    // When the box is collapsed, cancel interactions.
    // unlink is not necessary, exists for the lifetime of the sim.
    this.expandedProperty.lazyLink( expanded => {
      if ( !expanded ) {
        this.interruptSubtreeInput();
      }
    } );
  }
}

vectorAddition.register( 'EquationAccordionBox', EquationAccordionBox );