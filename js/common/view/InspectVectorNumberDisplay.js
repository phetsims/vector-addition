// Copyright 2019, University of Colorado Boulder

/**
 * View for a Number Display that goes on the 'Inspect a Vector' Panel at the top of the scene.
 *
 * Displays a single vector attribute (i.e. magnitude etc.) of a single active vector that is on the specified graph.
 *
 * 'Is a' relationship with NumberDisplay but adds:
 *  - Functionality to change the active vector without having to recreate the number display;
 *    NumberDisplays don't support the ability to change the NumberProperty of the panel.
 *    Recreating new NumberDisplays every time the active vector changes is costly. This creates the number property
 *    once and derives its value from the attribute of the active vector.
 *
 * This number display exists for the entire sim and is never disposed.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );

  // constants
  const NUMBER_DISPLAY_ROUNDING = VectorAdditionConstants.NUMBER_DISPLAY_ROUNDING;

  // enumeration of the possible attributes to display
  const ATTRIBUTE_DISPLAY_TYPES = new Enumeration( [ 'MAGNITUDE',
    'ANGLE',
    'X_COMPONENT',
    'Y_COMPONENT' ] );

  // range of the angle display
  const ANGLE_RANGE = new Range( -180, 180 );


  class InspectVectorNumberDisplay extends NumberDisplay {
    /**
     * @constructor
     *
     * @param {Graph} graph - the graph that contains the vectors to display
     * @param {Enumeration} attributeDisplayType - the attribute to display
     *                                             (see InspectVectorNumberDisplay.ATTRIBUTE_DISPLAY_TYPES)
     */
    constructor( graph, attributeDisplayType ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( ATTRIBUTE_DISPLAY_TYPES.includes( attributeDisplayType ),
        `invalid attributeDisplayType: ${attributeDisplayType}` );

      //----------------------------------------------------------------------------------------
      // Calculate the range
      //----------------------------------------------------------------------------------------

      // Convenience variables. These are constant for the entire sim.
      const maxMagnitude = graph.graphModelBounds.rightTop.distance( graph.graphModelBounds.leftBottom );
      const graphWidth = graph.graphModelBounds.width;
      const graphHeight = graph.graphModelBounds.height;

      let numberDisplayRange;

      if ( attributeDisplayType === ATTRIBUTE_DISPLAY_TYPES.ANGLE ) {
        numberDisplayRange = ANGLE_RANGE;
      }
      else if ( attributeDisplayType === ATTRIBUTE_DISPLAY_TYPES.MAGNITUDE ) {
        numberDisplayRange = new Range( 0, maxMagnitude );
      }
      else if ( attributeDisplayType === ATTRIBUTE_DISPLAY_TYPES.X_COMPONENT ) {
        numberDisplayRange = new Range( -graphWidth, graphWidth );
      }
      else if ( attributeDisplayType === ATTRIBUTE_DISPLAY_TYPES.Y_COMPONENT ) {
        numberDisplayRange = new Range( -graphHeight, graphHeight );
      }

      //----------------------------------------------------------------------------------------
      // Create the number display
      //----------------------------------------------------------------------------------------

      // Create the property that the NumberDisplay displays. Set to arbitrary null for now; to be updated.
      const numberDisplayProperty = new Property( null );

      super( numberDisplayProperty, numberDisplayRange, { decimalPlaces: NUMBER_DISPLAY_ROUNDING } );

      // @private {Enumeration} (final) reference to the attribute display type
      this.attributeDisplayType = attributeDisplayType;

      //----------------------------------------------------------------------------------------
      // Create links
      //----------------------------------------------------------------------------------------

      // Create function to update the number display value
      const activeVectorComponentsListener = () => {
        numberDisplayProperty.value = this.getNumberDisplayValue( graph.activeVectorProperty.value );
      };

      // Observe when the graph's active vector changes and update the vectorComponents link.
      // Doesn't need to be unlinked since the number display lasts the entire sim.
      graph.activeVectorProperty.link( ( activeVector, oldActiveVector ) => {

        // Unlink the previous link if the old active vector exists
        oldActiveVector && oldActiveVector.vectorComponentsProperty.unlink( activeVectorComponentsListener );

        // Observe when the active vector changes and update the number display value if and only if the active vector
        // exists
        activeVector && activeVector.vectorComponentsProperty.link( activeVectorComponentsListener );
      } );
    }

    /**
     * Gets the value to display based on the attribute display type and a vector
     * @private
     *
     * @param {VectorModel|null} activeVector - vector to derive the number display value from
     * @returns {number|null} value to display
     */
    getNumberDisplayValue( activeVector ) {

      assert && assert( activeVector instanceof VectorModel || activeVector === null,
        `invalid activeVector: ${activeVector}` );

      if ( !activeVector ) {
        return null;
      }

      if ( this.attributeDisplayType === ATTRIBUTE_DISPLAY_TYPES.MAGNITUDE ) {
        return activeVector.magnitude;
      }
      else if ( this.attributeDisplayType === ATTRIBUTE_DISPLAY_TYPES.ANGLE ) {
        return activeVector.vectorComponents.equalsEpsilon( Vector2.ZERO, 1e-7 ) ? null :
               Util.toDegrees( activeVector.angle ); // return null if the vector is magnitude 0
      }
      else if ( this.attributeDisplayType === ATTRIBUTE_DISPLAY_TYPES.X_COMPONENT ) {
        return activeVector.xComponent;
      }
      else if ( this.attributeDisplayType === ATTRIBUTE_DISPLAY_TYPES.Y_COMPONENT ) {
        return activeVector.yComponent;
      }
    }
  }

  // @public {Enumeration} possible attributes to display
  InspectVectorNumberDisplay.ATTRIBUTE_DISPLAY_TYPES = ATTRIBUTE_DISPLAY_TYPES;

  return vectorAddition.register( 'InspectVectorNumberDisplay', InspectVectorNumberDisplay );
} );