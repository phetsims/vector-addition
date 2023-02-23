// Copyright 2019-2023, University of Colorado Boulder

/**
 * EquationToggleBox is the toggle box labeled 'Equation' in the 'Equations' screen.
 * It allows the user to select the form of the equation, and change the coefficients of the vectors.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import { AlignBox, AlignGroup, HBox, Node, Text } from '../../../../scenery/js/imports.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import ToggleBox from '../../common/view/ToggleBox.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import EquationsVectorSet from '../model/EquationsVectorSet.js';
import EquationTypes from '../model/EquationTypes.js';
import EquationTypeNode from './EquationTypeNode.js';
import EquationTypesRadioButtonGroup from './EquationTypesRadioButtonGroup.js';

// constants
const TEXT_OPTIONS = { font: VectorAdditionConstants.EQUATION_FONT };

export default class EquationToggleBox extends ToggleBox {

  /**
   * @param {EquationsVectorSet} vectorSet
   * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty
   * @param {AlignGroup} equationButtonsAlignGroup - used to make all equation radio buttons the same size
   * @param {AlignGroup} equationsAlignGroup - used to make all interactive equations the same size
   * @param {Object} [options]
   */
  constructor( vectorSet, equationTypeProperty, equationButtonsAlignGroup, equationsAlignGroup, options ) {

    assert && assert( vectorSet instanceof EquationsVectorSet, `invalid vectorSet: ${vectorSet}` );
    assert && assert( equationTypeProperty instanceof EnumerationProperty, `invalid equationTypeProperty: ${equationTypeProperty}` );
    assert && assert( equationButtonsAlignGroup instanceof AlignGroup, `invalid equationButtonsAlignGroup: ${equationButtonsAlignGroup}` );
    assert && assert( equationsAlignGroup instanceof AlignGroup, `invalid equationsAlignGroup: ${equationsAlignGroup}` );
    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

    options = merge( {

      // superclass options
      contentFixedWidth: 670,
      contentFixedHeight: 50,
      contentXSpacing: 17

    }, options );

    // When the toggle box is collapsed, show 'Equation'
    const closedContent = new Text( VectorAdditionStrings.equation, TEXT_OPTIONS );

    // Radio buttons for selecting equation type
    const radioButtonGroup = new EquationTypesRadioButtonGroup(
      equationTypeProperty, vectorSet.symbols, equationButtonsAlignGroup, {
        scale: 0.75
      } );

    // Create an equation of each type, only one of which will be visible at a time.
    const equationsParent = new Node();
    EquationTypes.enumeration.values.forEach( equationType => {

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
    const openContent = new HBox( {
      children: [ radioButtonGroup, equationsParent ],
      spacing: 55
    } );

    super( closedContent, openContent, options );

    // When the box is collapsed, cancel interactions.
    // unlink is not necessary, exists for the lifetime of the sim.
    this.expandedProperty.lazyLink( expanded => {
      if ( !expanded ) {
        this.interruptSubtreeInput();
      }
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'EquationToggleBox is not intended to be disposed' );
  }
}

vectorAddition.register( 'EquationToggleBox', EquationToggleBox );