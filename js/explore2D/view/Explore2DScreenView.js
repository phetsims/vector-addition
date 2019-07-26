// Copyright 2019, University of Colorado Boulder

/**
 * Top level view for the 'Explore2D' screen.
 *
 * Explore2D has a polar and a cartesian graph. Scene nodes are created to represent these graphs respectively.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );
  const Explore2DGraphControlPanel = require( 'VECTOR_ADDITION/explore2D/view/Explore2DGraphControlPanel' );
  const Explore2DModel = require( 'VECTOR_ADDITION/explore2D/model/Explore2DModel' );
  const Explore2DVectorCreatorPanel = require( 'VECTOR_ADDITION/explore2D/view/Explore2DVectorCreatorPanel' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );

  // constants
  const EXPLORE_2D_VECTOR_SYMBOLS = VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_1;

  class Explore2DScreenView extends VectorAdditionScreenView {
    /**
     * @param {Explore2DModel} explore2DModel
     * @param {Tandem} tandem
     */
    constructor( explore2DModel, tandem ) {

      assert && assert( explore2DModel instanceof Explore2DModel, `invalid explore2DModel: ${explore2DModel}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );


      super( explore2DModel, tandem );

      this.viewProperties = new VectorAdditionViewProperties();

      //----------------------------------------------------------------------------------------
      // Create the scenes for the polar and cartesian scenes.
      const polarSceneNode = new SceneNode( explore2DModel.polarGraph,
        this.viewProperties.valuesVisibleProperty,
        this.viewProperties.angleVisibleProperty,
        this.viewProperties.gridVisibleProperty,
        explore2DModel.componentStyleProperty );

      const cartesianSceneNode = new SceneNode( explore2DModel.cartesianGraph,
        this.viewProperties.valuesVisibleProperty,
        this.viewProperties.angleVisibleProperty,
        this.viewProperties.gridVisibleProperty,
        explore2DModel.componentStyleProperty );
      this.addChild( polarSceneNode );
      this.addChild( cartesianSceneNode );
      //----------------------------------------------------------------------------------------
      // Create the vector creator panels

      polarSceneNode.addVectorCreatorPanel( new Explore2DVectorCreatorPanel( explore2DModel.polarGraph,
        polarSceneNode,
        EXPLORE_2D_VECTOR_SYMBOLS ) );

      cartesianSceneNode.addVectorCreatorPanel( new Explore2DVectorCreatorPanel( explore2DModel.cartesianGraph,
        cartesianSceneNode,
        EXPLORE_2D_VECTOR_SYMBOLS ) );

      //----------------------------------------------------------------------------------------
      // Toggle visibility of scenes based on which coordinate snap mode it is

      // Doesn't need to be unlinked since the scenes and explore2D scene is never disposed.
      this.viewProperties.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        polarSceneNode.visible = coordinateSnapMode === CoordinateSnapModes.POLAR;
        cartesianSceneNode.visible = coordinateSnapMode === CoordinateSnapModes.CARTESIAN;
      } );

      //----------------------------------------------------------------------------------------
      // Create the Coordinate snapping radio buttons

      this.addChild( new CoordinateSnapRadioButtonGroup( this.viewProperties.coordinateSnapModeProperty ) );

      //----------------------------------------------------------------------------------------
      // Create the Graph Control panel

      const explore2DGraphControlPanel = new Explore2DGraphControlPanel( this.viewProperties,
        explore2DModel.cartesianGraph.vectorSet,
        explore2DModel.polarGraph.vectorSet,
        explore2DModel.componentStyleProperty );

      this.addChild( explore2DGraphControlPanel );
    }

    reset() {
      this.viewProperties.reset();
    }
  }

  return vectorAddition.register( 'Explore2DScreenView', Explore2DScreenView );
} );