// Copyright 2019-2023, University of Colorado Boulder

/**
 * View for the radio button group near the top of the scene that allows the user to select a equation type.
 *
 * See EquationTypes.js
 *
 * 'Is a' relationship with RectangularRadioButtonGroup but adds:
 *    - Radio button for 'ADDITION' => 'a' + 'b' = 'c'
 *    - Radio button for 'SUBTRACTION' => 'a' - 'b' = 'c'
 *    - Radio button for 'NEGATION' => 'a' + 'b' + 'c' = 0
 *
 * Icons created from the VectorAdditionIconFactory.
 *
 * EquationTypesRadioButtonGroup is never disposed and exists for the entire simulation.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import { AlignBox, AlignGroup } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../../vectorAddition.js';
import EquationTypes from '../model/EquationTypes.js';

export default class EquationTypesRadioButtonGroup extends RectangularRadioButtonGroup {

  /**
   * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty - Property of the possible equation types
   * @param {string[]} vectorSymbols - symbols on the buttons
   * @param {AlignGroup} alignGroup
   * @param {Object} [options]
   */
  constructor( equationTypeProperty, vectorSymbols, alignGroup, options ) {

    assert && assert( equationTypeProperty instanceof EnumerationProperty, `invalid equationTypeProperty: ${equationTypeProperty}` );
    assert && assert( alignGroup instanceof AlignGroup, `invalid alignGroup: ${alignGroup}` );
    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

    options = merge( {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {
      xMargin: 12
    }, options );

    // Create the description of the buttons
    const content = [];
    EquationTypes.enumeration.values.forEach( equationType => {
      content.push( {
        value: equationType,
        createNode: () => new AlignBox( VectorAdditionIconFactory.createEquationTypeIcon( equationType, vectorSymbols ), {
          group: alignGroup
        } )
      } );
    } );

    super( equationTypeProperty, content, options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'EquationTypesRadioButtonGroup is not intended to be disposed' );
  }
}

vectorAddition.register( 'EquationTypesRadioButtonGroup', EquationTypesRadioButtonGroup );