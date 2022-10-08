// Copyright 2019-2022, University of Colorado Boulder

/**
 * Radio button group for switching between the Vertical and Horizontal graph.
 *
 * @author Brandon Li
 */

import EnumerationDeprecatedProperty from '../../../../axon/js/EnumerationDeprecatedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import GraphOrientations from '../../common/model/GraphOrientations.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../../vectorAddition.js';

class GraphOrientationRadioButtonGroup extends RectangularRadioButtonGroup {

  /**
   * @param {EnumerationDeprecatedProperty.<GraphOrientations>} graphOrientationProperty
   * @param {Object} [options]
   */
  constructor( graphOrientationProperty, options ) {

    assert && assert( graphOrientationProperty instanceof EnumerationDeprecatedProperty && GraphOrientations.includes( graphOrientationProperty.value ),
      `invalid graphOrientationProperty: ${graphOrientationProperty}` );
    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

    options = merge( {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, options );

    // Create the description of the buttons
    const content = [];
    [ GraphOrientations.HORIZONTAL, GraphOrientations.VERTICAL ].forEach( graphOrientation => {
      content.push( {
        value: graphOrientation,
        createNode: tandem => VectorAdditionIconFactory.createGraphOrientationIcon( graphOrientation )
      } );
    } );

    super( graphOrientationProperty, content, options );
  }
}

vectorAddition.register( 'GraphOrientationRadioButtonGroup', GraphOrientationRadioButtonGroup );
export default GraphOrientationRadioButtonGroup;