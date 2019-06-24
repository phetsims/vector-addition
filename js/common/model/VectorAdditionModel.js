// Copyright 2019, University of Colorado Boulder

/**
 * The shared model for every Screen respectively. Its main responsibility is to control the state
 * of the simulation.
 *
 * The model is not specific for an individual graph as it toggles global 'settings' of the simulation. For example,
 * turning on the 'angle visible' option on the control panel means the angle is visible for every graph.
 *
 * The model can also have an unknown amount of graphs (see Graph.js for more documentation).
 *
 * The model also has an unknown amount of sum visible properties: there could be one global sum visible property or
 * a sum visible property for each vector set.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  const STARTING_COMPONENT_STYLE = ComponentStyles.INVISIBLE;
  const STARTING_COORDINATE_SNAP_MODE = CoordinateSnapModes.CARTESIAN;

  class VectorAdditionModel {
    /**
     * @constructor
     * @param {array.<BooleanProperty>} sumVisibleProperties - an array of the sim visible properties
     * @param {Tandem} tandem
     */
    constructor( sumVisibleProperties, tandem ) {

      assert && assert( sumVisibleProperties.filter(
        sumVisibleProperty => !( sumVisibleProperty instanceof BooleanProperty ) ).length === 0,
        `invalid sumVisibleProperties: ${sumVisibleProperties}` );

      //----------------------------------------------------------------------------------------
      // Visibility Properties

      // @public {BooleanProperty}
      this.valuesVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty}
      this.gridVisibleProperty = new BooleanProperty( true );

      // @public {BooleanProperty} - controls the visibility of the angle
      this.angleVisibleProperty = new BooleanProperty( false );

      // @private {array.<BooleanProperty>} - private because sub classes should create their own references to the
      // individual properties
      this.sumVisibleProperties = sumVisibleProperties;


      //----------------------------------------------------------------------------------------
      // Enumeration Properties

      // @public {EnumerationProperty<ComponentStyles>} - controls the visibility of the component styles
      this.componentStyleProperty = new EnumerationProperty( ComponentStyles, STARTING_COMPONENT_STYLE );

      // @public {EnumerationProperty<CoordinateSnapModes>} - controls the snapping mode for the vectors
      this.coordinateSnapModeProperty = new EnumerationProperty( CoordinateSnapModes, STARTING_COORDINATE_SNAP_MODE );

      //----------------------------------------------------------------------------------------
      // Graphs

      // @public {array.<Graph>} graphs - array of the graphs, see addGraph for documentation to add a graph
      this.graphs = [];
    }

    /**
     * Add a graph to the model
     * @param {Dimension2} graphDimension - the dimensions for the graph (width and height)
     * @param {Vector2} upperLeftPosition - the coordinate of the upperLeft corner of the graph.
     * @param {GraphOrientations} orientation - the orientation of the graph
     * @returns {Graph} - the graph added
     * @public
     */
    addGraph( graphDimension, upperLeftPosition, orientation ) {

      const newGraph = new Graph( graphDimension, upperLeftPosition, orientation );
      this.graphs.push( newGraph );
      return newGraph;
    }

    /**
     * @public
     * Reset the VectorAdditionModel
     */
    reset() {

      // Reset the visible properties
      this.valuesVisibleProperty.reset();
      this.gridVisibleProperty.reset();
      this.angleVisibleProperty.reset();
      this.sumVisibleProperties.forEach( ( sumVisibleProperty ) => sumVisibleProperty.reset() );

      // Reset the enumeration properties
      this.componentStyleProperty.reset();
      this.coordinateSnapModeProperty.reset();

      // Reset every graph
      this.graphs.forEach( ( graph ) => {
        graph.reset();
      } );
    }
  }

  return vectorAddition.register( 'VectorAdditionModel', VectorAdditionModel );
} );